'use client';

import { useState, useEffect } from 'react';
import { X, HelpCircle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Quiz } from '@/types';
import { studentApi } from '@/helpers/axios/api';

interface QuizModalProps {
    quiz: Quiz & { questionCount?: number };
    isOpen: boolean;
    onClose: () => void;
    onSubmitSuccess: () => void;
}

interface QuizQuestion {
    question: string;
    options: string[];
}

export const QuizModal = ({ quiz, isOpen, onClose, onSubmitSuccess }: QuizModalProps) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState<{ score: number; correctAnswers: number; totalQuestions: number } | null>(null);
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && quiz) {
            setCurrentQuestionIndex(0);
            setShowResults(false);
            setResults(null);
            setIsLoading(true);
            setError(null);

            // Fetch quiz questions from API
            const fetchQuizQuestions = async () => {
                try {
                    const response = await studentApi.getQuizById(quiz._id);
                    const quizData = response.data.data;
                    if (quizData && quizData.questions) {
                        setQuestions(quizData.questions.map(q => ({
                            question: q.question,
                            options: q.options,
                        })));
                        setAnswers(new Array(quizData.questions.length).fill(-1));
                    } else {
                        setError('No questions available for this quiz');
                    }
                } catch (err) {
                    console.error('Error fetching quiz:', err);
                    setError('Failed to load quiz questions');
                } finally {
                    setIsLoading(false);
                }
            };

            fetchQuizQuestions();
        }
    }, [isOpen, quiz]);

    if (!isOpen) return null;

    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    const allAnswered = answers.every(a => a !== -1);

    const handleSelectAnswer = (optionIndex: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = optionIndex;
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = async () => {
        if (!allAnswered) {
            setError('Please answer all questions before submitting');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await studentApi.submitQuiz(quiz._id, answers);
            const resultData = response.data.data;
            if (resultData) {
                setResults(resultData);
                setShowResults(true);
                onSubmitSuccess();
            }
        } catch (err) {
            setError('Failed to submit quiz. Please try again.');
            console.error('Error submitting quiz:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setShowResults(false);
        setResults(null);
        onClose();
    };

    // Results view
    if (showResults && results) {
        const passed = results.score >= 70;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <Card className="w-full max-w-md mx-4">
                    <CardContent className="p-6 text-center">
                        <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
                            {passed ? (
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            ) : (
                                <XCircle className="w-10 h-10 text-red-600" />
                            )}
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {passed ? 'Congratulations!' : 'Keep Practicing!'}
                        </h2>

                        <p className="text-gray-600 mb-4">
                            You scored {results.score}% ({results.correctAnswers}/{results.totalQuestions} correct)
                        </p>

                        <Badge variant={passed ? 'success' : 'secondary'} className="mb-6">
                            {passed ? 'Passed' : 'Try Again'}
                        </Badge>

                        <div className="flex justify-center space-x-2">
                            <Button variant="outline" onClick={handleClose}>
                                Close
                            </Button>
                            {!passed && (
                                <Button onClick={() => {
                                    setShowResults(false);
                                    setResults(null);
                                    setAnswers(new Array(totalQuestions).fill(-1));
                                    setCurrentQuestionIndex(0);
                                }}>
                                    Retry Quiz
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Loading view
    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <Card className="w-full max-w-2xl mx-4">
                    <CardContent className="p-6 text-center">
                        <p className="text-gray-600">Loading quiz...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Error view
    if (error && !currentQuestion) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <Card className="w-full max-w-2xl mx-4">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">{quiz.title}</h2>
                            <Button variant="ghost" size="icon" onClick={onClose}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                        <p className="text-red-600">{error}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <div className="flex items-center space-x-2 mb-1">
                                <HelpCircle className="w-5 h-5 text-purple-500" />
                                <h2 className="text-xl font-bold text-gray-900">{quiz.title}</h2>
                            </div>
                            <p className="text-sm text-gray-500">
                                Question {currentQuestionIndex + 1} of {totalQuestions}
                            </p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Progress */}
                    <Progress value={progress} className="mb-6" />

                    {/* Question */}
                    {currentQuestion && (
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {currentQuestion.question}
                            </h3>

                            <div className="space-y-3">
                                {currentQuestion.options.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSelectAnswer(index)}
                                        className={`w-full p-4 text-left border rounded-lg transition-colors ${answers[currentQuestionIndex] === index
                                            ? 'border-purple-500 bg-purple-50 text-purple-900'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className="font-medium mr-2">
                                            {String.fromCharCode(65 + index)}.
                                        </span>
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between">
                        <Button
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={currentQuestionIndex === 0}
                        >
                            Previous
                        </Button>

                        <div className="flex space-x-2">
                            {currentQuestionIndex < totalQuestions - 1 ? (
                                <Button onClick={handleNext}>
                                    Next
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || !allAnswered}
                                    className="bg-purple-600 hover:bg-purple-700"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Question indicators */}
                    <div className="mt-6 flex flex-wrap gap-2 justify-center">
                        {answers.map((answer, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentQuestionIndex(index)}
                                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${currentQuestionIndex === index
                                    ? 'bg-purple-600 text-white'
                                    : answer !== -1
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-600'
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default QuizModal;
