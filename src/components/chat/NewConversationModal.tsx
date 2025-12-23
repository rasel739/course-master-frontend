'use client';

import { useState } from 'react';
import { X, MessageSquare } from 'lucide-react';
import { Instructor, Student } from '@/types';

interface NewConversationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStartConversation: (participantId: string, initialMessage?: string) => void;
    instructors?: Instructor[];
    students?: Student[];
    isAdmin?: boolean;
    isLoading?: boolean;
}

export default function NewConversationModal({
    isOpen,
    onClose,
    onStartConversation,
    instructors = [],
    students = [],
    isAdmin = false,
    isLoading = false,
}: NewConversationModalProps) {
    const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);
    const [message, setMessage] = useState('');

    // Use students for admin, instructors for students
    const participants = isAdmin ? students : instructors;
    const participantLabel = isAdmin ? 'student' : 'instructor';

    const handleSubmit = () => {
        if (selectedParticipant) {
            onStartConversation(selectedParticipant, message.trim() || undefined);
            setSelectedParticipant(null);
            setMessage('');
        }
    };

    const handleClose = () => {
        setSelectedParticipant(null);
        setMessage('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-gray-800">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        New Conversation
                    </h2>
                    <button
                        onClick={handleClose}
                        className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                        Select {isAdmin ? 'a student' : 'an instructor'} to start a conversation
                    </p>

                    {/* Participants List */}
                    <div className="mb-4 max-h-48 space-y-2 overflow-y-auto">
                        {participants.length === 0 ? (
                            <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                No {participantLabel}s available
                            </p>
                        ) : (
                            participants.map((participant) => (
                                <button
                                    key={participant._id}
                                    onClick={() => setSelectedParticipant(participant._id)}
                                    className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors ${selectedParticipant === participant._id
                                        ? 'bg-indigo-50 ring-2 ring-indigo-500 dark:bg-indigo-900/30'
                                        : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium text-white ${isAdmin
                                            ? 'bg-gradient-to-br from-green-500 to-teal-600'
                                            : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                                        }`}>
                                        {participant.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {participant.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {participant.email}
                                        </p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Initial Message */}
                    {selectedParticipant && (
                        <div className="mt-4">
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Initial message (optional)
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Say hello..."
                                rows={3}
                                className="w-full resize-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-700">
                    <button
                        onClick={handleClose}
                        className="rounded-xl px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedParticipant || isLoading}
                        className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLoading ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                            <MessageSquare className="h-4 w-4" />
                        )}
                        Start Conversation
                    </button>
                </div>
            </div>
        </div>
    );
}

