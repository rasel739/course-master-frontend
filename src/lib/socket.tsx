'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import { ChatMessage } from '@/types';

interface TypingUser {
    conversationId: string;
    userId: string;
}

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    joinConversation: (conversationId: string) => void;
    leaveConversation: (conversationId: string) => void;
    sendMessage: (conversationId: string, content: string) => Promise<ChatMessage | null>;
    startTyping: (conversationId: string) => void;
    stopTyping: (conversationId: string) => void;
    markAsRead: (conversationId: string) => void;
    typingUsers: TypingUser[];
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
    const typingTimeoutRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
    const [token, setToken] = useState<string | undefined>(undefined);

    // Check for token changes
    useEffect(() => {
        const checkToken = () => {
            const currentToken = Cookies.get('accessToken');
            if (currentToken !== token) {
                setToken(currentToken);
            }
        };

        checkToken();
        const interval = setInterval(checkToken, 1000);
        return () => clearInterval(interval);
    }, [token]);

    useEffect(() => {
        if (!token) {
            // Close existing socket if token is removed (logout)
            if (socket) {
                socket.close();
                setSocket(null);
                setIsConnected(false);
            }
            return;
        }

        const socketUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';

        const newSocket = io(socketUrl, {
            auth: { token },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        newSocket.on('connect', () => {
            console.log('Socket connected');
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected');
            setIsConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            console.error('Socket connection error:', error.message);
            setIsConnected(false);
        });

        // Handle typing indicators
        newSocket.on('user_typing', ({ conversationId, userId }: TypingUser) => {
            setTypingUsers((prev) => {
                const exists = prev.find((t) => t.conversationId === conversationId && t.userId === userId);
                if (exists) return prev;
                return [...prev, { conversationId, userId }];
            });
        });

        newSocket.on('user_stopped_typing', ({ conversationId, userId }: TypingUser) => {
            setTypingUsers((prev) =>
                prev.filter((t) => !(t.conversationId === conversationId && t.userId === userId))
            );
        });

        setSocket(newSocket);

        return () => {
            // Clear all typing timeouts on cleanup
            typingTimeoutRef.current.forEach((timeout) => clearTimeout(timeout));
            typingTimeoutRef.current.clear();
            newSocket.close();
        };
    }, [token]);

    const joinConversation = useCallback(
        (conversationId: string) => {
            if (socket && isConnected) {
                socket.emit('join_conversation', conversationId);
            }
        },
        [socket, isConnected]
    );

    const leaveConversation = useCallback(
        (conversationId: string) => {
            if (socket && isConnected) {
                socket.emit('leave_conversation', conversationId);
            }
        },
        [socket, isConnected]
    );

    const sendMessage = useCallback(
        (conversationId: string, content: string): Promise<ChatMessage | null> => {
            return new Promise((resolve) => {
                if (socket && isConnected) {
                    socket.emit(
                        'send_message',
                        { conversationId, content },
                        (response: { success?: boolean; message?: ChatMessage; error?: string }) => {
                            if (response.success && response.message) {
                                resolve(response.message);
                            } else {
                                console.error('Failed to send message:', response.error);
                                resolve(null);
                            }
                        }
                    );
                } else {
                    resolve(null);
                }
            });
        },
        [socket, isConnected]
    );

    const startTyping = useCallback(
        (conversationId: string) => {
            if (socket && isConnected) {
                socket.emit('typing_start', conversationId);

                // Auto-stop typing after 3 seconds
                const existingTimeout = typingTimeoutRef.current.get(conversationId);
                if (existingTimeout) {
                    clearTimeout(existingTimeout);
                }

                const timeout = setTimeout(() => {
                    socket.emit('typing_stop', conversationId);
                    typingTimeoutRef.current.delete(conversationId);
                }, 3000);

                typingTimeoutRef.current.set(conversationId, timeout);
            }
        },
        [socket, isConnected]
    );

    const stopTyping = useCallback(
        (conversationId: string) => {
            if (socket && isConnected) {
                socket.emit('typing_stop', conversationId);

                const existingTimeout = typingTimeoutRef.current.get(conversationId);
                if (existingTimeout) {
                    clearTimeout(existingTimeout);
                    typingTimeoutRef.current.delete(conversationId);
                }
            }
        },
        [socket, isConnected]
    );

    const markAsRead = useCallback(
        (conversationId: string) => {
            if (socket && isConnected) {
                socket.emit('mark_read', conversationId);
            }
        },
        [socket, isConnected]
    );

    return (
        <SocketContext.Provider
            value={{
                socket,
                isConnected,
                joinConversation,
                leaveConversation,
                sendMessage,
                startTyping,
                stopTyping,
                markAsRead,
                typingUsers,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
}
