'use client';

import { useCallback, useRef, useState, useEffect } from 'react';

interface UseWebRTCOptions {
    onRemoteStream?: (stream: MediaStream) => void;
    onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
    onIceCandidate?: (candidate: RTCIceCandidate) => void;
}

interface UseWebRTCReturn {
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    connectionState: RTCPeerConnectionState | null;
    isAudioEnabled: boolean;
    isVideoEnabled: boolean;
    initializeMedia: (video: boolean) => Promise<MediaStream | null>;
    createOffer: () => Promise<RTCSessionDescriptionInit | null>;
    createAnswer: (offer: RTCSessionDescriptionInit) => Promise<RTCSessionDescriptionInit | null>;
    setRemoteDescription: (description: RTCSessionDescriptionInit) => Promise<void>;
    addIceCandidate: (candidate: RTCIceCandidateInit) => Promise<void>;
    toggleAudio: () => void;
    toggleVideo: () => void;
    cleanup: () => void;
}

// STUN servers for NAT traversal
const ICE_SERVERS: RTCConfiguration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
    ],
};

export function useWebRTC(options: UseWebRTCOptions = {}): UseWebRTCReturn {
    const { onRemoteStream, onConnectionStateChange, onIceCandidate } = options;

    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const remoteStreamRef = useRef<MediaStream | null>(null);

    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [connectionState, setConnectionState] = useState<RTCPeerConnectionState | null>(null);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);

    // Create peer connection
    const createPeerConnection = useCallback(() => {
        if (peerConnectionRef.current) return peerConnectionRef.current;

        const pc = new RTCPeerConnection(ICE_SERVERS);

        pc.onicecandidate = (event) => {
            if (event.candidate && onIceCandidate) {
                onIceCandidate(event.candidate);
            }
        };

        pc.ontrack = (event) => {
            const stream = event.streams[0];
            remoteStreamRef.current = stream;
            setRemoteStream(stream);
            if (onRemoteStream) {
                onRemoteStream(stream);
            }
        };

        pc.onconnectionstatechange = () => {
            setConnectionState(pc.connectionState);
            if (onConnectionStateChange) {
                onConnectionStateChange(pc.connectionState);
            }
        };

        peerConnectionRef.current = pc;
        return pc;
    }, [onIceCandidate, onRemoteStream, onConnectionStateChange]);

    // Initialize media (camera/microphone)
    const initializeMedia = useCallback(async (video: boolean): Promise<MediaStream | null> => {
        try {
            const constraints: MediaStreamConstraints = {
                audio: true,
                video: video ? { width: 1280, height: 720, facingMode: 'user' } : false,
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            localStreamRef.current = stream;
            setLocalStream(stream);
            setIsAudioEnabled(true);
            setIsVideoEnabled(video);

            // Add tracks to peer connection
            const pc = createPeerConnection();
            stream.getTracks().forEach((track) => {
                pc.addTrack(track, stream);
            });

            return stream;
        } catch (error) {
            console.error('Error accessing media devices:', error);
            return null;
        }
    }, [createPeerConnection]);

    // Create SDP offer
    const createOffer = useCallback(async (): Promise<RTCSessionDescriptionInit | null> => {
        try {
            const pc = peerConnectionRef.current;
            if (!pc) return null;

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            return offer;
        } catch (error) {
            console.error('Error creating offer:', error);
            return null;
        }
    }, []);

    // Create SDP answer
    const createAnswer = useCallback(async (offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit | null> => {
        try {
            const pc = createPeerConnection();
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            return answer;
        } catch (error) {
            console.error('Error creating answer:', error);
            return null;
        }
    }, [createPeerConnection]);

    // Set remote description (for handling offer/answer)
    const setRemoteDescription = useCallback(async (description: RTCSessionDescriptionInit): Promise<void> => {
        try {
            const pc = peerConnectionRef.current;
            if (!pc) return;
            await pc.setRemoteDescription(new RTCSessionDescription(description));
        } catch (error) {
            console.error('Error setting remote description:', error);
        }
    }, []);

    // Add ICE candidate
    const addIceCandidate = useCallback(async (candidate: RTCIceCandidateInit): Promise<void> => {
        try {
            const pc = peerConnectionRef.current;
            if (!pc) return;
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
            console.error('Error adding ICE candidate:', error);
        }
    }, []);

    // Toggle audio
    const toggleAudio = useCallback(() => {
        const stream = localStreamRef.current;
        if (!stream) return;

        stream.getAudioTracks().forEach((track) => {
            track.enabled = !track.enabled;
        });
        setIsAudioEnabled((prev) => !prev);
    }, []);

    // Toggle video
    const toggleVideo = useCallback(() => {
        const stream = localStreamRef.current;
        if (!stream) return;

        stream.getVideoTracks().forEach((track) => {
            track.enabled = !track.enabled;
        });
        setIsVideoEnabled((prev) => !prev);
    }, []);

    // Cleanup
    const cleanup = useCallback(() => {
        // Stop all tracks
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => track.stop());
            localStreamRef.current = null;
            setLocalStream(null);
        }

        if (remoteStreamRef.current) {
            remoteStreamRef.current.getTracks().forEach((track) => track.stop());
            remoteStreamRef.current = null;
            setRemoteStream(null);
        }

        // Close peer connection
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }

        setConnectionState(null);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            cleanup();
        };
    }, [cleanup]);

    return {
        localStream,
        remoteStream,
        connectionState,
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
    };
}
