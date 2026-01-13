'use client';

import Link from 'next/link';
import { CheckCircle, BookOpen, ArrowRight, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CHECKOUT_STEPS } from '@/constants/student';

const CheckoutSuccessPage = () => {
  const date = new Date();
  const orderNumber = `ORD-${date.getTime().toString(36).toUpperCase()}`;

  return (
    <div className='max-w-2xl mx-auto text-center py-12'>
      {/* Success Icon */}
      <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6'>
        <CheckCircle className='w-10 h-10 text-green-600' />
      </div>

      <h1 className='text-3xl font-bold text-gray-900 mb-4'>Payment Successful! 🎉</h1>
      <p className='text-lg text-gray-600 mb-8'>
        Thank you for your purchase. You now have access to your new courses.
      </p>

      {/* Order Details */}
      <Card className='mb-8'>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between mb-4 pb-4 border-b'>
            <span className='text-gray-600'>Order Number:</span>
            <span className='font-mono font-bold'>{orderNumber}</span>
          </div>

          <p className='text-sm text-gray-600'>
            A confirmation email has been sent to your email address with the order details.
          </p>
        </CardContent>
      </Card>

      {/* What's Next */}
      <Card className='mb-8'>
        <CardContent className='p-6'>
          <h2 className='text-lg font-bold text-gray-900 mb-4'>What&apos;s Next?</h2>
          <div className='space-y-4 text-left'>
            {CHECKOUT_STEPS.map((step, index) => (
              <div key={index} className='flex items-start gap-3'>
                <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0'>
                  <span className='text-blue-600 font-bold text-sm'>{index + 1}</span>
                </div>
                <div>
                  <p className='font-medium text-gray-900'>{step.title}</p>
                  <p className='text-sm text-gray-600'>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className='flex flex-col sm:flex-row gap-4 justify-center'>
        <Link href='/student'>
          <Button size='lg' className='w-full sm:w-auto'>
            <BookOpen className='w-5 h-5 mr-2' />
            Go to Dashboard
          </Button>
        </Link>
        <Link href='/course'>
          <Button size='lg' variant='outline' className='w-full sm:w-auto'>
            Browse More Courses
            <ArrowRight className='w-5 h-5 ml-2' />
          </Button>
        </Link>
      </div>

      {/* Share */}
      <div className='mt-12 pt-8 border-t'>
        <p className='text-sm text-gray-600 mb-4'>Share your learning journey!</p>
        <div className='flex justify-center gap-4'>
          <Button variant='outline' size='sm'>
            <Share2 className='w-4 h-4 mr-2' />
            Share on Twitter
          </Button>
          <Button variant='outline' size='sm'>
            <Share2 className='w-4 h-4 mr-2' />
            Share on LinkedIn
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
