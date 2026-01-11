'use client';

import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const NotFound = () => {
  const navigate = useRouter();

  return (
    <div className='min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4'>
      <div className='max-w-lg w-full text-center'>
        <div className='relative mb-8'>
          <h1 className='text-[150px] md:text-[200px] font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600 opacity-20 select-none'>
            404
          </h1>
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='w-24 h-24 bg-linear-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center animate-pulse'>
              <Search className='w-12 h-12 text-white' />
            </div>
          </div>
        </div>

        <h2 className='text-3xl font-bold text-gray-900 mb-4'>Page Not Found</h2>
        <p className='text-gray-600 mb-8 max-w-md mx-auto'>
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s
          get you back on track.
        </p>

        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Link href='/'>
            <Button size='lg' className='w-full sm:w-auto'>
              <Home className='w-4 h-4 mr-2' />
              Go Home
            </Button>
          </Link>
          <Button
            size='lg'
            variant='outline'
            onClick={() => navigate.back()}
            className='w-full sm:w-auto'
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            Go Back
          </Button>
        </div>

        <div className='mt-12 pt-8 border-t border-gray-200'>
          <div className='flex flex-wrap justify-center gap-4 text-sm'>
            <Link href='/courses' className='text-blue-600 hover:text-blue-700 hover:underline'>
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NotFound;
