'use client';

import { ChatConversation, ChatParticipant } from '@/types';
import { useEffect, useRef } from 'react';
import { MessageSquare, Wifi, WifiOff, Phone, Video } from 'lucide-react';
import ChatMessageItem from './ChatMessage';
import ChatMessageInput from './ChatMessageInput';
import { useCall } from '@/lib/callContext';

interface ChatMessage {
    _id: string;
    sender: {
        _id: string;
        name: string;
        avatar?: string;
    };
    content: string;
    isRead: boolean;
    createdAt: string;
}

interface ChatWindowProps {
    conversation: ChatConversation | null;
    messages: ChatMessage[];
    currentUserId: string;
    onSendMessage: (content: string) => void;
    onTyping?: () => void;
    isLoading?: boolean;
    isSending?: boolean;
    isTyping?: boolean;
    isConnected?: boolean;
}

export default function ChatWindow({
    conversation,
    messages,
    currentUserId,
    onSendMessage,
    onTyping,
    isLoading = false,
    isSending = false,
    isTyping = false,
    isConnected = true,
}: ChatWindowProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const getOtherParticipant = (participants: ChatParticipant[]): ChatParticipant | null => {
        return participants.find((p) => p._id !== currentUserId) || null;
    };

    if (!conversation) {
        return (
            <div className="flex h-full flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
                <MessageSquare className="mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Select a conversation
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Choose a conversation from the sidebar to start chatting
                </p>
            </div>
        );
    }

    const otherParticipant = getOtherParticipant(conversation.participants);

    return (
        <div className="flex h-full flex-col bg-white dark:bg-gray-800">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-medium text-white">
                        {otherParticipant?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                            {otherParticipant?.name || 'Unknown'}
                        </h3>
                        {conversation.course && (
                            <p className="text-xs text-indigo-600 dark:text-indigo-400">
                                {conversation.course.title}
                            </p>
                        )}
                        {otherParticipant?.role === 'admin' && (
                            <span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                                Instructor
                            </span>
                        )}
                    </div>
                </div>
                {/* Connection status and Call buttons */}
                <div className="flex items-center gap-2">
                    {/* Call buttons */}
                    {otherParticipant && isConnected && (
                        <>
                            <CallButtons
                                conversationId={conversation._id}
                                participantId={otherParticipant._id}
                                participantName={otherParticipant.name}
                            />
                        </>
                    )}
                    {isConnected ? (
                        <div className="flex items-center gap-1.5 text-xs text-green-600">
                            <Wifi className="h-3.5 w-3.5" />
                            <span>Connected</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 text-xs text-red-500">
                            <WifiOff className="h-3.5 w-3.5" />
                            <span>Disconnected</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <MessageSquare className="mb-3 h-12 w-12 text-gray-300 dark:text-gray-600" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            No messages yet. Say hello!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <ChatMessageItem
                                key={message._id}
                                message={message}
                                isOwn={message.sender._id === currentUserId}
                            />
                        ))}
                        {/* Typing indicator */}
                        {isTyping && (
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        {otherParticipant?.name?.charAt(0) || '?'}
                                    </span>
                                </div>
                                <div className="rounded-2xl bg-gray-100 px-4 py-2 dark:bg-gray-700">
                                    <div className="flex gap-1">
                                        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
                                        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
                                        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input */}
            <ChatMessageInput
                onSend={onSendMessage}
                onTyping={onTyping}
                isDisabled={isSending || !isConnected}
            />
        </div>
    );
}

// Separate component for call buttons to use the call hook
function CallButtons({ conversationId, participantId, participantName }: {
    conversationId: string;
    participantId: string;
    participantName: string;
}) {
    const { initiateCall, callState } = useCall();
    const isInCall = callState !== 'idle';

    const handleAudioCall = () => {
        if (!isInCall) {
            initiateCall(conversationId, participantId, participantName, 'audio');
        }
    };

    const handleVideoCall = () => {
        if (!isInCall) {
            initiateCall(conversationId, participantId, participantName, 'video');
        }
    };

    return (
        <>
            <button
                onClick={handleAudioCall}
                disabled={isInCall}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Audio call"
            >
                <Phone className="h-4 w-4" />
            </button>
            <button
                onClick={handleVideoCall}
                disabled={isInCall}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Video call"
            >
                <Video className="h-4 w-4" />
            </button>
        </>
    );
}
