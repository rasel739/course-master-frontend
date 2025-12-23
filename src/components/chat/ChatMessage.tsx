'use client';

import { Check, CheckCheck } from 'lucide-react';

interface ChatMessageProps {
    message: {
        _id: string;
        sender: {
            _id: string;
            name: string;
            avatar?: string;
        };
        content: string;
        isRead: boolean;
        createdAt: string;
    };
    isOwn: boolean;
}

export default function ChatMessageItem({ message, isOwn }: ChatMessageProps) {
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${isOwn
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                    }`}
            >
                {!isOwn && (
                    <p className="mb-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                        {message.sender.name}
                    </p>
                )}
                <p className="whitespace-pre-wrap break-words text-sm">{message.content}</p>
                <div
                    className={`mt-1 flex items-center justify-end gap-1 text-xs ${isOwn ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'
                        }`}
                >
                    <span>{formatTime(message.createdAt)}</span>
                    {isOwn && (
                        message.isRead ? (
                            <CheckCheck className="h-3.5 w-3.5" />
                        ) : (
                            <Check className="h-3.5 w-3.5" />
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
