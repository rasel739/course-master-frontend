import { Loader2 } from 'lucide-react';

const Loading = () => {
  return (
    <div className='min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center'>
      <div className='text-center'>
        <div className='relative mb-8'>
          <div className='absolute inset-0 flex items-center justify-center'>
            <Loader2 className='w-8 h-8 text-blue-600 animate-spin' />
          </div>
        </div>

        <h2 className='text-xl font-semibold text-gray-900 mb-2'>Loading...</h2>
        <p className='text-gray-600'>Please wait while we load your content</p>

        <div className='flex justify-center gap-1 mt-4'>
          <span
            className='w-2 h-2 bg-blue-600 rounded-full animate-bounce'
            style={{ animationDelay: '0ms' }}
          />
          <span
            className='w-2 h-2 bg-blue-600 rounded-full animate-bounce'
            style={{ animationDelay: '150ms' }}
          />
          <span
            className='w-2 h-2 bg-blue-600 rounded-full animate-bounce'
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
};
export default Loading;
