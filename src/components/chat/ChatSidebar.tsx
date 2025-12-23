'use client';

import { ChatConversation, ChatParticipant } from '@/types';
import { MessageSquare, Search, Plus } from 'lucide-react';

interface ChatSidebarProps {
    conversations: ChatConversation[];
    activeConversationId?: string;
    currentUserId: string;
    onSelectConversation: (conversation: ChatConversation) => void;
    onNewConversation: () => void;
    isLoading?: boolean;
}

export default function ChatSidebar({
    conversations,
    activeConversationId,
    currentUserId,
    onSelectConversation,
    onNewConversation,
    isLoading = false,
}: ChatSidebarProps) {
    const getOtherParticipant = (participants: ChatParticipant[]): ChatParticipant | null => {
        return participants.find((p) => p._id !== currentUserId) || null;
    };

    const formatTime = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return date.toLocaleDateString([], { weekday: 'short' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

    const truncateMessage = (message: string, maxLength: number = 40) => {
        if (message.length <= maxLength) return message;
        return message.substring(0, maxLength) + '...';
    };

    return (
        <div className="flex h-full flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Messages</h2>
                <button
                    onClick={onNewConversation}
                    className="rounded-full bg-indigo-600 p-2 text-white transition-colors hover:bg-indigo-700"
                    title="New conversation"
                >
                    <Plus className="h-4 w-4" />
                </button>
            </div>

            {/* Search */}
            <div className="border-b border-gray-200 p-3 dark:border-gray-700">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    />
                </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <MessageSquare className="mb-3 h-12 w-12 text-gray-300 dark:text-gray-600" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">No conversations yet</p>
                        <button
                            onClick={onNewConversation}
                            className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                        >
                            Start a conversation
                        </button>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {conversations.map((conversation) => {
                            const otherParticipant = getOtherParticipant(conversation.participants);
                            const isActive = conversation._id === activeConversationId;
                            const hasUnread = (conversation.unreadCount || 0) > 0;

                            return (
                                <li key={conversation._id}>
                                    <button
                                        onClick={() => onSelectConversation(conversation)}
                                        className={`w-full px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            {/* Avatar */}
                                            <div className="relative flex-shrink-0">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-medium text-white">
                                                    {otherParticipant?.name?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                {hasUnread && (
                                                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                                                        {conversation.unreadCount}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <p
                                                        className={`truncate text-sm font-medium ${hasUnread
                                                                ? 'text-gray-900 dark:text-white'
                                                                : 'text-gray-700 dark:text-gray-300'
                                                            }`}
                                                    >
                                                        {otherParticipant?.name || 'Unknown'}
                                                    </p>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {formatTime(conversation.lastMessageAt)}
                                                    </span>
                                                </div>
                                                {conversation.course && (
                                                    <p className="truncate text-xs text-indigo-600 dark:text-indigo-400">
                                                        {conversation.course.title}
                                                    </p>
                                                )}
                                                {conversation.lastMessage && (
                                                    <p
                                                        className={`mt-0.5 truncate text-sm ${hasUnread
                                                                ? 'font-medium text-gray-800 dark:text-gray-200'
                                                                : 'text-gray-500 dark:text-gray-400'
                                                            }`}
                                                    >
                                                        {truncateMessage(conversation.lastMessage.content)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}
