'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Flag, ChevronDown } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Rating } from '@/components/ui/rating';
import { cn } from '@/utils';

interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  content: string;
  helpful: number;
  notHelpful: number;
}

interface ReviewsSectionProps {
  averageRating?: number;
  totalReviews?: number;
  ratingBreakdown?: { stars: number; count: number }[];
  reviews?: Review[];
  className?: string;
}

const mockReviews: Review[] = [
  {
    id: '1',
    userName: 'John D.',
    rating: 5,
    date: '2 weeks ago',
    content:
      'Excellent course! The instructor explains complex concepts in a very understandable way. The projects are practical and helped me build a solid portfolio. Highly recommended for anyone looking to break into web development.',
    helpful: 124,
    notHelpful: 3,
  },
  {
    id: '2',
    userName: 'Sarah M.',
    rating: 4,
    date: '1 month ago',
    content:
      'Great content and well-structured curriculum. I learned a lot and feel confident in my skills now. Only giving 4 stars because some sections could use more practice exercises.',
    helpful: 89,
    notHelpful: 5,
  },
  {
    id: '3',
    userName: 'Mike R.',
    rating: 5,
    date: '1 month ago',
    content:
      'This is the best online course I have ever taken. The instructor is knowledgeable and the community support is amazing. Worth every penny!',
    helpful: 156,
    notHelpful: 2,
  },
];

const defaultBreakdown = [
  { stars: 5, count: 2500 },
  { stars: 4, count: 800 },
  { stars: 3, count: 200 },
  { stars: 2, count: 50 },
  { stars: 1, count: 25 },
];

export const ReviewsSection = ({
  averageRating = 4.7,
  totalReviews = 3575,
  ratingBreakdown = defaultBreakdown,
  reviews = mockReviews,
  className,
}: ReviewsSectionProps) => {
  const [showAll, setShowAll] = useState(false);
  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  const maxCount = Math.max(...ratingBreakdown.map((r) => r.count));

  return (
    <div className={cn('', className)}>
      <h2 className='text-xl font-bold text-gray-900 mb-6'>Student Reviews</h2>

      {/* Rating Overview */}
      <div className='flex flex-col md:flex-row gap-8 mb-8'>
        {/* Average Rating */}
        <div className='text-center md:text-left'>
          <div className='text-6xl font-bold text-amber-700 mb-2'>{averageRating}</div>
          <Rating
            value={averageRating}
            size='md'
            className='justify-center md:justify-start mb-1'
          />
          <p className='text-sm text-gray-500'>Course Rating</p>
        </div>

        {/* Breakdown */}
        <div className='flex-1 space-y-2'>
          {ratingBreakdown.map(({ stars, count }) => (
            <div key={stars} className='flex items-center gap-3'>
              <div className='flex items-center gap-1 w-20 shrink-0'>
                <Rating value={stars} max={5} size='sm' />
              </div>
              <div className='flex-1'>
                <div className='h-2 bg-gray-200 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-amber-500 rounded-full transition-all'
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
              <span className='text-sm text-blue-600 hover:underline cursor-pointer w-16 text-right'>
                {Math.round((count / totalReviews) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className='space-y-6'>
        {displayedReviews.map((review) => (
          <div key={review.id} className='border-b border-gray-200 pb-6 last:border-0'>
            <div className='flex items-start gap-4'>
              <Avatar size='md' fallback={review.userName} src={review.userAvatar} />
              <div className='flex-1'>
                <div className='flex items-center gap-3 mb-1'>
                  <span className='font-semibold text-gray-900'>{review.userName}</span>
                  <Rating value={review.rating} size='sm' />
                </div>
                <p className='text-sm text-gray-500 mb-3'>{review.date}</p>
                <p className='text-gray-700 mb-4'>{review.content}</p>

                <div className='flex items-center gap-4 text-sm text-gray-500'>
                  <span>Was this review helpful?</span>
                  <button className='flex items-center gap-1 hover:text-blue-600 transition-colors'>
                    <ThumbsUp className='w-4 h-4' />
                    <span>{review.helpful}</span>
                  </button>
                  <button className='flex items-center gap-1 hover:text-red-600 transition-colors'>
                    <ThumbsDown className='w-4 h-4' />
                    <span>{review.notHelpful}</span>
                  </button>
                  <button className='flex items-center gap-1 hover:text-gray-700 transition-colors ml-auto'>
                    <Flag className='w-4 h-4' />
                    Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reviews.length > 3 && (
        <Button variant='outline' className='w-full mt-6' onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Show Less' : `Show All ${totalReviews.toLocaleString()} Reviews`}
          <ChevronDown
            className={cn('w-4 h-4 ml-2 transition-transform', showAll && 'rotate-180')}
          />
        </Button>
      )}
    </div>
  );
};

export default ReviewsSection;
