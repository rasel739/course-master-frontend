'use client';

import { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatMessageInputProps {
    onSend: (content: string) => void;
    onTyping?: () => void;
    isDisabled?: boolean;
    placeholder?: string;
}

export default function ChatMessageInput({
    onSend,
    onTyping,
    isDisabled = false,
    placeholder = 'Type a message...',
}: ChatMessageInputProps) {
    const [message, setMessage] = useState('');
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    const handleSend = () => {
        const trimmedMessage = message.trim();
        if (trimmedMessage && !isDisabled) {
            onSend(trimmedMessage);
            setMessage('');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);

        // Trigger typing indicator
        if (onTyping && e.target.value.trim()) {
            // Debounce typing events
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            onTyping();
            typingTimeoutRef.current = setTimeout(() => {
                typingTimeoutRef.current = null;
            }, 1000);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-end gap-3">
                <div className="relative flex-1">
                    <textarea
                        value={message}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        disabled={isDisabled}
                        rows={1}
                        className="max-h-32 w-full resize-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                        style={{ minHeight: '48px' }}
                    />
                </div>
                <button
                    onClick={handleSend}
                    disabled={!message.trim() || isDisabled}
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isDisabled && message.trim() ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                        <Send className="h-5 w-5" />
                    )}
                </button>
            </div>
            <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                Press Enter to send, Shift+Enter for new line
            </p>
        </div>
    );
}
