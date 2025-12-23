'use client';

import { useState } from 'react';
import { Award, Star, Send, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { certificateApi, reviewApi } from '@/helpers/axios/api';
import { useRouter } from 'next/navigation';

interface CourseCompletionBannerProps {
    enrollmentId: string;
    courseId: string;
    courseName: string;
    progress: number;
    onReviewSubmitted?: () => void;
}

export const CourseCompletionBanner = ({
    enrollmentId,
    courseId,
    courseName,
    progress,
    onReviewSubmitted,
}: CourseCompletionBannerProps) => {
    const router = useRouter();
    const [generatingCert, setGeneratingCert] = useState(false);
    const [certGenerated, setCertGenerated] = useState(false);
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewSubmitted, setReviewSubmitted] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewContent, setReviewContent] = useState('');
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [error, setError] = useState('');

    const isCompleted = progress >= 100;

    const handleGenerateCertificate = async () => {
        setGeneratingCert(true);
        setError('');
        try {
            await certificateApi.generateCertificate(enrollmentId);
            setCertGenerated(true);
            // Navigate to certificates page
            setTimeout(() => {
                router.push('/certificates');
            }, 1500);
        } catch (err) {
            setError('Failed to generate certificate. Please try again.');
            console.error(err);
        } finally {
            setGeneratingCert(false);
        }
    };

    const handleSubmitReview = async () => {
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }
        if (reviewContent.length < 10) {
            setError('Review must be at least 10 characters');
            return;
        }

        setSubmittingReview(true);
        setError('');
        try {
            await reviewApi.submitReview(courseId, { rating, content: reviewContent });
            setReviewSubmitted(true);
            setShowReviewForm(false);
            onReviewSubmitted?.();
        } catch (err) {
            setError('Failed to submit review. Please try again.');
            console.error(err);
        } finally {
            setSubmittingReview(false);
        }
    };

    if (!isCompleted) {
        return null;
    }

    return (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 mb-6">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-6 h-6" />
                    🎉 Congratulations! You completed this course!
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-gray-700">
                    You have successfully completed <strong>{courseName}</strong>.
                    You can now get your certificate and leave a review.
                </p>

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <div className="flex flex-wrap gap-3">
                    {/* Certificate Button */}
                    {!certGenerated ? (
                        <Button
                            onClick={handleGenerateCertificate}
                            disabled={generatingCert}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {generatingCert ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Award className="w-4 h-4 mr-2" />
                                    Get Certificate
                                </>
                            )}
                        </Button>
                    ) : (
                        <Button variant="outline" className="text-green-600 border-green-600">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Certificate Generated!
                        </Button>
                    )}

                    {/* Review Button */}
                    {!reviewSubmitted && !showReviewForm && (
                        <Button variant="outline" onClick={() => setShowReviewForm(true)}>
                            <Star className="w-4 h-4 mr-2" />
                            Leave a Review
                        </Button>
                    )}

                    {reviewSubmitted && (
                        <Button variant="outline" className="text-green-600 border-green-600" disabled>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Review Submitted!
                        </Button>
                    )}
                </div>

                {/* Review Form */}
                {showReviewForm && !reviewSubmitted && (
                    <div className="bg-white rounded-lg p-4 border mt-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Rate this course</h4>

                        {/* Star Rating */}
                        <div className="flex items-center gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="focus:outline-none"
                                >
                                    <Star
                                        className={`w-8 h-8 transition-colors ${star <= (hoverRating || rating)
                                                ? 'text-yellow-400 fill-yellow-400'
                                                : 'text-gray-300'
                                            }`}
                                    />
                                </button>
                            ))}
                            <span className="ml-2 text-sm text-gray-600">
                                {rating > 0 ? `${rating} out of 5` : 'Select rating'}
                            </span>
                        </div>

                        {/* Review Text */}
                        <textarea
                            value={reviewContent}
                            onChange={(e) => setReviewContent(e.target.value)}
                            placeholder="Share your experience with this course..."
                            className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={4}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {reviewContent.length}/2000 characters (minimum 10)
                        </p>

                        <div className="flex gap-2 mt-3">
                            <Button
                                onClick={handleSubmitReview}
                                disabled={submittingReview}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                {submittingReview ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        Submit Review
                                    </>
                                )}
                            </Button>
                            <Button variant="ghost" onClick={() => setShowReviewForm(false)}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default CourseCompletionBanner;
