'use client';

import { useEffect, useRef, useState } from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Maximize2, Minimize2 } from 'lucide-react';
import { useCall } from '@/lib/callContext';

export default function VideoCallModal() {
    const {
        callState,
        currentCall,
        localStream,
        remoteStream,
        isAudioEnabled,
        isVideoEnabled,
        endCall,
        toggleAudio,
        toggleVideo,
    } = useCall();

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const [callDuration, setCallDuration] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const callStartTimeRef = useRef<number | null>(null);

    // Set up local video stream
    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    // Set up remote video stream
    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    // Track call duration
    useEffect(() => {
        if (callState === 'ongoing') {
            callStartTimeRef.current = Date.now();
            const interval = setInterval(() => {
                if (callStartTimeRef.current) {
                    setCallDuration(Math.floor((Date.now() - callStartTimeRef.current) / 1000));
                }
            }, 1000);
            return () => clearInterval(interval);
        } else {
            callStartTimeRef.current = null;
            setCallDuration(0);
        }
    }, [callState]);

    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    // Don't render if not in a call
    if (callState === 'idle' || !currentCall) return null;

    const isVideoCall = currentCall.type === 'video';

    return (
        <div className={`fixed inset-0 z-[100] bg-gray-900 ${isFullscreen ? '' : 'p-4 md:p-8'}`}>
            <div className={`relative w-full h-full ${isFullscreen ? '' : 'rounded-2xl overflow-hidden'} bg-gray-900 flex flex-col`}>
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/70 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {currentCall.participantName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="text-white font-medium">{currentCall.participantName}</h3>
                            <p className="text-gray-300 text-sm">
                                {callState === 'ringing' && 'Ringing...'}
                                {callState === 'connecting' && 'Connecting...'}
                                {callState === 'ongoing' && formatDuration(callDuration)}
                                {callState === 'initiating' && 'Initiating...'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={toggleFullscreen}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                        {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                    </button>
                </div>

                {/* Video Container */}
                <div className="flex-1 relative">
                    {/* Remote Video (or audio placeholder) */}
                    {isVideoCall ? (
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                            <div className="text-center">
                                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold mb-4">
                                    {currentCall.participantName.charAt(0).toUpperCase()}
                                </div>
                                <h2 className="text-white text-2xl font-semibold">{currentCall.participantName}</h2>
                                <p className="text-gray-400 mt-2">
                                    {callState === 'ongoing' ? 'Audio call in progress' : 'Connecting...'}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Local Video (Picture in Picture) */}
                    {isVideoCall && localStream && (
                        <div className="absolute bottom-24 right-4 w-32 h-48 md:w-48 md:h-64 rounded-xl overflow-hidden shadow-xl border-2 border-gray-700">
                            <video
                                ref={localVideoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                            />
                            {!isVideoEnabled && (
                                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                                    <VideoOff className="w-8 h-8 text-gray-400" />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                    <div className="flex items-center justify-center gap-4">
                        {/* Mute Audio */}
                        <button
                            onClick={toggleAudio}
                            className={`p-4 rounded-full transition-colors ${isAudioEnabled
                                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                    : 'bg-red-500 hover:bg-red-600 text-white'
                                }`}
                        >
                            {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                        </button>

                        {/* Toggle Video (only for video calls) */}
                        {isVideoCall && (
                            <button
                                onClick={toggleVideo}
                                className={`p-4 rounded-full transition-colors ${isVideoEnabled
                                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                        : 'bg-red-500 hover:bg-red-600 text-white'
                                    }`}
                            >
                                {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                            </button>
                        )}

                        {/* End Call */}
                        <button
                            onClick={endCall}
                            className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
                        >
                            <PhoneOff className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
