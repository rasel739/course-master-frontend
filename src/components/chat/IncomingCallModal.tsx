'use client';

import { Phone, Video, X } from 'lucide-react';
import { useCall } from '@/lib/callContext';
import { useEffect, useRef } from 'react';

export default function IncomingCallModal() {
    const { incomingCall, acceptCall, rejectCall } = useCall();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Play ringtone when incoming call
    useEffect(() => {
        if (incomingCall) {
            // Create and play ringtone
            audioRef.current = new Audio('/sounds/ringtone.mp3');
            audioRef.current.loop = true;
            audioRef.current.play().catch(() => {
                // Autoplay might be blocked
                console.log('Ringtone autoplay blocked');
            });

            return () => {
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current = null;
                }
            };
        }
    }, [incomingCall]);

    if (!incomingCall) return null;

    const isVideoCall = incomingCall.type === 'video';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl max-w-sm w-full mx-4 text-center animate-pulse-slow">
                {/* Caller Avatar */}
                <div className="relative inline-block mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                        {incomingCall.participantName.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center animate-ping">
                        {isVideoCall ? (
                            <Video className="w-4 h-4 text-white" />
                        ) : (
                            <Phone className="w-4 h-4 text-white" />
                        )}
                    </div>
                </div>

                {/* Caller Info */}
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {incomingCall.participantName}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                    Incoming {isVideoCall ? 'video' : 'audio'} call...
                </p>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-6">
                    {/* Reject */}
                    <button
                        onClick={rejectCall}
                        className="group relative p-5 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-red-500/25 transition-all"
                    >
                        <X className="w-7 h-7" />
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Decline
                        </span>
                    </button>

                    {/* Accept */}
                    <button
                        onClick={acceptCall}
                        className="group relative p-5 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-green-500/25 transition-all animate-bounce"
                    >
                        {isVideoCall ? (
                            <Video className="w-7 h-7" />
                        ) : (
                            <Phone className="w-7 h-7" />
                        )}
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Accept
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
