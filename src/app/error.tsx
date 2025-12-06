'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Page error:', error);
    }, [error]);

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4'>
            <Card className='max-w-md w-full'>
                <CardContent className='pt-8 pb-8 text-center'>
                    {/* Error Icon */}
                    <div className='mb-6'>
                        <div className='w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center'>
                            <AlertCircle className='w-8 h-8 text-red-600' />
                        </div>
                    </div>

                    {/* Message */}
                    <h2 className='text-2xl font-bold text-gray-900 mb-3'>
                        Oops! Something went wrong
                    </h2>
                    <p className='text-gray-600 mb-6'>
                        We encountered an error while loading this page. Please try again.
                    </p>

                    {error.digest && (
                        <p className='text-xs text-gray-400 mb-6'>
                            Error ID: {error.digest}
                        </p>
                    )}

                    {/* Actions */}
                    <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                        <Button onClick={reset} className='w-full sm:w-auto'>
                            <RefreshCw className='w-4 h-4 mr-2' />
                            Try Again
                        </Button>
                        <Button
                            variant='outline'
                            onClick={() => window.history.back()}
                            className='w-full sm:w-auto'
                        >
                            <ArrowLeft className='w-4 h-4 mr-2' />
                            Go Back
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
