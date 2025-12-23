'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import {
    fetchConversations,
    fetchMessages,
    fetchStudents,
    fetchUnreadCount,
    createConversation,
    markConversationAsRead,
    setActiveConversation,
    addMessage,
} from '@/redux/features/chatSlice';
import { useSocket } from '@/lib/socket';
import { ChatConversation, ChatMessage } from '@/types';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatWindow from '@/components/chat/ChatWindow';
import NewConversationModal from '@/components/chat/NewConversationModal';
import { ArrowLeft } from 'lucide-react';

export default function AdminChatPage() {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const {
        conversations,
        activeConversation,
        messages,
        students,
        isLoading,
        isMessagesLoading,
        isSending,
    } = useAppSelector((state) => state.chat);

    const {
        socket,
        isConnected,
        joinConversation,
        leaveConversation,
        sendMessage: socketSendMessage,
        startTyping,
        stopTyping,
        markAsRead,
        typingUsers,
    } = useSocket();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [localIsSending, setLocalIsSending] = useState(false);
    const [showMobileChat, setShowMobileChat] = useState(false);

    // Initial data fetch - fetch students for admin instead of instructors
    useEffect(() => {
        dispatch(fetchConversations());
        dispatch(fetchStudents());
        dispatch(fetchUnreadCount());
    }, [dispatch]);

    // Load messages when conversation changes
    useEffect(() => {
        if (activeConversation) {
            dispatch(fetchMessages({ conversationId: activeConversation._id }));
            dispatch(markConversationAsRead(activeConversation._id));
        }
    }, [dispatch, activeConversation]);

    // Join/leave socket room when conversation changes
    useEffect(() => {
        if (!activeConversation || !isConnected) return;

        joinConversation(activeConversation._id);
        markAsRead(activeConversation._id);

        return () => {
            leaveConversation(activeConversation._id);
        };
    }, [activeConversation, isConnected, joinConversation, leaveConversation, markAsRead]);

    // Listen for new messages via socket
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (message: ChatMessage) => {
            const messageExists = messages.some((m) => m._id === message._id);
            if (!messageExists) {
                dispatch(addMessage(message));
            }
        };

        const handleMessageNotification = ({
            conversationId,
            message,
        }: {
            conversationId: string;
            message: ChatMessage;
        }) => {
            dispatch(fetchConversations());
            dispatch(fetchUnreadCount());

            if (activeConversation && conversationId === activeConversation._id) {
                const messageExists = messages.some((m) => m._id === message._id);
                if (!messageExists) {
                    dispatch(addMessage(message));
                }
            }
        };

        const handleMessagesRead = () => {
            if (activeConversation) {
                dispatch(fetchMessages({ conversationId: activeConversation._id }));
            }
        };

        socket.on('new_message', handleNewMessage);
        socket.on('message_notification', handleMessageNotification);
        socket.on('messages_read', handleMessagesRead);

        return () => {
            socket.off('new_message', handleNewMessage);
            socket.off('message_notification', handleMessageNotification);
            socket.off('messages_read', handleMessagesRead);
        };
    }, [socket, activeConversation, messages, dispatch]);

    const handleSelectConversation = useCallback(
        (conversation: ChatConversation) => {
            dispatch(setActiveConversation(conversation));
            setShowMobileChat(true);
        },
        [dispatch]
    );

    const handleBackToList = useCallback(() => {
        setShowMobileChat(false);
    }, []);

    const handleNewConversation = () => {
        setIsModalOpen(true);
    };

    const handleStartConversation = (participantId: string, initialMessage?: string) => {
        dispatch(createConversation({ participantId, initialMessage }));
        setIsModalOpen(false);
        setShowMobileChat(true);
    };

    const handleSendMessage = useCallback(
        async (content: string) => {
            if (!activeConversation || !isConnected) return;

            setLocalIsSending(true);
            stopTyping(activeConversation._id);

            const message = await socketSendMessage(activeConversation._id, content);

            if (message) {
                dispatch(fetchConversations());
            }

            setLocalIsSending(false);
        },
        [activeConversation, isConnected, socketSendMessage, stopTyping, dispatch]
    );

    const handleTyping = useCallback(() => {
        if (activeConversation && isConnected) {
            startTyping(activeConversation._id);
        }
    }, [activeConversation, isConnected, startTyping]);

    const isTyping = activeConversation
        ? typingUsers.some((t) => t.conversationId === activeConversation._id && t.userId !== user?._id)
        : false;

    if (!user) {
        return (
            <div className='flex h-[calc(100vh-64px)] items-center justify-center px-4'>
                <p className='text-gray-500 text-center'>Please log in to access chat</p>
            </div>
        );
    }

    return (
        <div className='h-[calc(100vh-80px)] overflow-hidden -m-3 sm:-m-4 lg:-m-6'>
            <div className='flex h-full bg-white rounded-lg shadow-sm overflow-hidden'>
                {/* Sidebar - Hidden on mobile when viewing chat */}
                <div
                    className={`${showMobileChat ? 'hidden' : 'w-full'} md:block md:w-72 lg:w-80 shrink-0`}
                >
                    <ChatSidebar
                        conversations={conversations}
                        activeConversationId={activeConversation?._id}
                        currentUserId={user._id}
                        onSelectConversation={handleSelectConversation}
                        onNewConversation={handleNewConversation}
                        isLoading={isLoading}
                    />
                </div>

                {/* Chat Window - Full width on mobile */}
                <div className={`${showMobileChat ? 'w-full' : 'hidden'} md:block md:flex-1`}>
                    {/* Mobile back button header */}
                    {showMobileChat && (
                        <div className='md:hidden flex items-center gap-2 px-3 py-2 border-b bg-white'>
                            <button
                                onClick={handleBackToList}
                                className='p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors'
                            >
                                <ArrowLeft className='w-5 h-5' />
                            </button>
                            <span className='font-medium text-sm'>Back to conversations</span>
                        </div>
                    )}
                    <ChatWindow
                        conversation={activeConversation}
                        messages={messages}
                        currentUserId={user._id}
                        onSendMessage={handleSendMessage}
                        onTyping={handleTyping}
                        isLoading={isMessagesLoading}
                        isSending={isSending || localIsSending}
                        isTyping={isTyping}
                        isConnected={isConnected}
                    />
                </div>
            </div>

            {/* New Conversation Modal - shows students for admin */}
            <NewConversationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onStartConversation={handleStartConversation}
                students={students}
                isAdmin={true}
                isLoading={isLoading}
            />
        </div>
    );
}
