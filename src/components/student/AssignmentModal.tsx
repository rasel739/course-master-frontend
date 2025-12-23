'use client';

import { useState } from 'react';
import { X, FileText, Link, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Assignment } from '@/types';
import { studentApi } from '@/helpers/axios/api';

interface AssignmentModalProps {
    assignment: Assignment & { hasSubmitted?: boolean; userSubmission?: { content: string; submissionType: string } | null };
    isOpen: boolean;
    onClose: () => void;
    onSubmitSuccess: () => void;
}

export const AssignmentModal = ({ assignment, isOpen, onClose, onSubmitSuccess }: AssignmentModalProps) => {
    const [submissionType, setSubmissionType] = useState<'text' | 'link'>('text');
    const [content, setContent] = useState(assignment.userSubmission?.content || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!content.trim()) {
            setError('Please enter your submission content');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await studentApi.submitAssignment(assignment._id, {
                submissionType,
                content: content.trim(),
            });
            onSubmitSuccess();
            onClose();
        } catch (err) {
            setError('Failed to submit assignment. Please try again.');
            console.error('Error submitting assignment:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <div className="flex items-center space-x-2 mb-2">
                                <FileText className="w-5 h-5 text-blue-500" />
                                <h2 className="text-xl font-bold text-gray-900">{assignment.title}</h2>
                            </div>
                            {assignment.hasSubmitted && (
                                <Badge variant="success">Already Submitted</Badge>
                            )}
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h3 className="font-medium text-gray-900 mb-2">Assignment Description</h3>
                        <p className="text-gray-600">{assignment.description}</p>
                    </div>

                    {/* Submission Type */}
                    <div className="mb-4">
                        <h3 className="font-medium text-gray-900 mb-2">Submission Type</h3>
                        <div className="flex space-x-2">
                            <Button
                                variant={submissionType === 'text' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSubmissionType('text')}
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                Text
                            </Button>
                            <Button
                                variant={submissionType === 'link' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSubmissionType('link')}
                            >
                                <Link className="w-4 h-4 mr-2" />
                                Link
                            </Button>
                        </div>
                    </div>

                    {/* Content Input */}
                    <div className="mb-4">
                        <h3 className="font-medium text-gray-900 mb-2">
                            {submissionType === 'text' ? 'Your Answer' : 'Submission Link'}
                        </h3>
                        {submissionType === 'text' ? (
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Enter your answer here..."
                                className="w-full h-48 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        ) : (
                            <input
                                type="url"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="https://..."
                                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        )}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                            <Send className="w-4 h-4 mr-2" />
                            {isSubmitting ? 'Submitting...' : assignment.hasSubmitted ? 'Update Submission' : 'Submit'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AssignmentModal;
