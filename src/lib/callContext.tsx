'use client';

import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { useSocket } from './socket';
import { useWebRTC } from '@/hooks/useWebRTC';

interface CallInfo {
    callId: string;
    participantId: string;
    participantName: string;
    conversationId: string;
    type: 'audio' | 'video';
    isIncoming: boolean;
}

type CallState = 'idle' | 'initiating' | 'ringing' | 'connecting' | 'ongoing';

interface CallContextType {
    callState: CallState;
    currentCall: CallInfo | null;
    incomingCall: CallInfo | null;
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    isAudioEnabled: boolean;
    isVideoEnabled: boolean;
    initiateCall: (conversationId: string, calleeId: string, calleeName: string, type: 'audio' | 'video') => Promise<void>;
    acceptCall: () => Promise<void>;
    rejectCall: () => void;
    endCall: () => void;
    toggleAudio: () => void;
    toggleVideo: () => void;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export function CallProvider({ children }: { children: React.ReactNode }) {
    const { socket, isConnected } = useSocket();
    const [callState, setCallState] = useState<CallState>('idle');
    const [currentCall, setCurrentCall] = useState<CallInfo | null>(null);
    const [incomingCall, setIncomingCall] = useState<CallInfo | null>(null);

    const handleIceCandidate = useCallback((candidate: RTCIceCandidate) => {
        if (socket && currentCall) {
            socket.emit('ice_candidate', {
                callId: currentCall.callId,
                signal: candidate.toJSON(),
            });
        }
    }, [socket, currentCall]);

    const {
        localStream,
        remoteStream,
        isAudioEnabled,
        isVideoEnabled,
        initializeMedia,
        createOffer,
        createAnswer,
        setRemoteDescription,
        addIceCandidate,
        toggleAudio,
        toggleVideo,
        cleanup,
    } = useWebRTC({
        onIceCandidate: handleIceCandidate,
        onConnectionStateChange: (state) => {
            if (state === 'connected') {
                setCallState('ongoing');
            } else if (state === 'disconnected' || state === 'failed') {
                endCall();
            }
        },
    });

    // Initiate a call
    const initiateCall = useCallback(async (
        conversationId: string,
        calleeId: string,
        calleeName: string,
        type: 'audio' | 'video'
    ) => {
        if (!socket || !isConnected) return;

        setCallState('initiating');

        // Initialize media first
        const stream = await initializeMedia(type === 'video');
        if (!stream) {
            setCallState('idle');
            return;
        }

        // Initiate call through socket
        socket.emit('initiate_call', { conversationId, calleeId, type }, async (response: { success?: boolean; callId?: string; error?: string }) => {
            if (response.success && response.callId) {
                setCurrentCall({
                    callId: response.callId,
                    participantId: calleeId,
                    participantName: calleeName,
                    conversationId,
                    type,
                    isIncoming: false,
                });
                setCallState('ringing');
            } else {
                console.error('Failed to initiate call:', response.error);
                cleanup();
                setCallState('idle');
            }
        });
    }, [socket, isConnected, initializeMedia, cleanup]);

    // Accept incoming call
    const acceptCall = useCallback(async () => {
        if (!socket || !incomingCall) return;

        setCallState('connecting');

        // Initialize media
        const stream = await initializeMedia(incomingCall.type === 'video');
        if (!stream) {
            rejectCall();
            return;
        }

        setCurrentCall(incomingCall);
        setIncomingCall(null);

        socket.emit('accept_call', incomingCall.callId, (response: { success?: boolean; error?: string }) => {
            if (!response.success) {
                console.error('Failed to accept call:', response.error);
                cleanup();
                setCallState('idle');
                setCurrentCall(null);
            }
        });
    }, [socket, incomingCall, initializeMedia, cleanup]);

    // Reject incoming call
    const rejectCall = useCallback(() => {
        if (!socket || !incomingCall) return;

        socket.emit('reject_call', incomingCall.callId, () => {
            setIncomingCall(null);
        });
    }, [socket, incomingCall]);

    // End current call
    const endCall = useCallback(() => {
        if (socket && currentCall) {
            socket.emit('end_call', currentCall.callId, () => {
                // Callback
            });
        }

        cleanup();
        setCallState('idle');
        setCurrentCall(null);
        setIncomingCall(null);
    }, [socket, currentCall, cleanup]);

    // Listen for socket events
    useEffect(() => {
        if (!socket) return;

        // Incoming call
        const handleIncomingCall = (data: {
            callId: string;
            callerId: string;
            callerName: string;
            conversationId: string;
            type: 'audio' | 'video';
        }) => {
            // Don't accept new calls if already in a call
            if (callState !== 'idle') return;

            setIncomingCall({
                callId: data.callId,
                participantId: data.callerId,
                participantName: data.callerName || 'Unknown',
                conversationId: data.conversationId,
                type: data.type,
                isIncoming: true,
            });
        };

        // Call accepted
        const handleCallAccepted = async () => {
            setCallState('connecting');
            // Create and send offer
            const offer = await createOffer();
            if (offer && currentCall) {
                socket.emit('call_offer', {
                    callId: currentCall.callId,
                    signal: offer,
                });
            }
        };

        // Call rejected
        const handleCallRejected = () => {
            cleanup();
            setCallState('idle');
            setCurrentCall(null);
        };

        // Call ended
        const handleCallEnded = () => {
            cleanup();
            setCallState('idle');
            setCurrentCall(null);
        };

        // Receive offer
        const handleCallOffer = async (data: { callId: string; signal: RTCSessionDescriptionInit }) => {
            const answer = await createAnswer(data.signal);
            if (answer) {
                socket.emit('call_answer', {
                    callId: data.callId,
                    signal: answer,
                });
            }
        };

        // Receive answer
        const handleCallAnswer = async (data: { callId: string; signal: RTCSessionDescriptionInit }) => {
            await setRemoteDescription(data.signal);
        };

        // Receive ICE candidate
        const handleIceCandidate = async (data: { callId: string; candidate: RTCIceCandidateInit }) => {
            await addIceCandidate(data.candidate);
        };

        socket.on('incoming_call', handleIncomingCall);
        socket.on('call_accepted', handleCallAccepted);
        socket.on('call_rejected', handleCallRejected);
        socket.on('call_ended', handleCallEnded);
        socket.on('call_offer', handleCallOffer);
        socket.on('call_answer', handleCallAnswer);
        socket.on('ice_candidate', handleIceCandidate);

        return () => {
            socket.off('incoming_call', handleIncomingCall);
            socket.off('call_accepted', handleCallAccepted);
            socket.off('call_rejected', handleCallRejected);
            socket.off('call_ended', handleCallEnded);
            socket.off('call_offer', handleCallOffer);
            socket.off('call_answer', handleCallAnswer);
            socket.off('ice_candidate', handleIceCandidate);
        };
    }, [socket, callState, currentCall, createOffer, createAnswer, setRemoteDescription, addIceCandidate, cleanup]);

    return (
        <CallContext.Provider
            value={{
                callState,
                currentCall,
                incomingCall,
                localStream,
                remoteStream,
                isAudioEnabled,
                isVideoEnabled,
                initiateCall,
                acceptCall,
                rejectCall,
                endCall,
                toggleAudio,
                toggleVideo,
            }}
        >
            {children}
        </CallContext.Provider>
    );
}

export function useCall() {
    const context = useContext(CallContext);
    if (context === undefined) {
        throw new Error('useCall must be used within a CallProvider');
    }
    return context;
}
