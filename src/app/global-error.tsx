'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className='min-h-screen bg-linear-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4'>
          <div className='max-w-lg w-full text-center'>
            <div className='mb-8'>
              <div className='w-24 h-24 mx-auto bg-linear-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center animate-pulse'>
                <AlertTriangle className='w-12 h-12 text-white' />
              </div>
            </div>

            <h1 className='text-3xl font-bold text-gray-900 mb-4'>Something Went Wrong</h1>
            <p className='text-gray-600 mb-2'>
              We apologize for the inconvenience. An unexpected error has occurred.
            </p>
            {error.digest && (
              <p className='text-sm text-gray-500 mb-8'>
                Error ID: <code className='bg-gray-100 px-2 py-1 rounded'>{error.digest}</code>
              </p>
            )}

            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Button
                size='lg'
                onClick={reset}
                className='w-full sm:w-auto bg-linear-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600'
              >
                <RefreshCw className='w-4 h-4 mr-2' />
                Try Again
              </Button>
              <Button
                size='lg'
                variant='outline'
                onClick={() => (window.location.href = '/')}
                className='w-full sm:w-auto'
              >
                <Home className='w-4 h-4 mr-2' />
                Go Home
              </Button>
            </div>

            <div className='mt-12 pt-8 border-t border-gray-200'>
              <p className='text-sm text-gray-500'>
                If this problem persists, please contact support or try again later.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
