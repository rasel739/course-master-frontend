'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock, Play, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rating } from '@/components/ui/rating';
import { cn } from '@/utils';
import { Course } from '@/types';
import { formatDuration, formatPrice } from '@/utils';
import { useAppSelector } from '@/redux/hook';

interface CourseCardProps {
  course: Course;
  variant?: 'default' | 'horizontal' | 'compact';
  showProgress?: boolean;
  progress?: number;
  className?: string;
}

export const CourseCard = ({
  course,
  variant = 'default',
  showProgress = false,
  progress = 0,
  className,
}: CourseCardProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const totalLessons =
    course.totalLessons || course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const totalDuration =
    course.totalDuration ||
    course.modules.reduce((sum, m) => sum + m.lessons.reduce((s, l) => s + l.duration, 0), 0);

  // Use real rating data from course
  const rating = course.averageRating || 4.5;
  const reviewCount = course.totalReviews || 0;

  if (variant === 'horizontal') {
    return (
      <Link href={`/${user?.role}/course/${course._id}`} className={cn('block group', className)}>
        <Card className='overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1'>
          <div className='flex flex-col md:flex-row'>
            <div className='relative w-full md:w-64 h-48 md:h-auto shrink-0 bg-gray-200'>
              {course.thumbnail ? (
                <Image src={course.thumbnail} alt={course.title} fill className='object-cover' />
              ) : (
                <div className='absolute inset-0 bg-linear-to-br from-blue-500 to-purple-600' />
              )}
              <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all' />
            </div>

            <CardContent className='flex-1 p-5'>
              <div className='flex items-start justify-between gap-4'>
                <div className='flex-1'>
                  <h3 className='font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2'>
                    {course.title}
                  </h3>
                  <p className='text-sm text-gray-500 mb-2 line-clamp-2'>{course.description}</p>
                  <p className='text-sm text-gray-600 mb-2'>{course.instructor}</p>

                  <div className='flex items-center space-x-2 mb-2'>
                    <span className='font-bold text-amber-700'>{rating.toFixed(1)}</span>
                    <Rating value={rating} size='sm' />
                    <span className='text-xs text-gray-500'>
                      ({reviewCount.toLocaleString()} reviews)
                    </span>
                  </div>

                  <div className='flex items-center space-x-4 text-xs text-gray-500'>
                    <span className='flex items-center'>
                      <Clock className='w-3.5 h-3.5 mr-1' />
                      {formatDuration(totalDuration)}
                    </span>
                    <span className='flex items-center'>
                      <Play className='w-3.5 h-3.5 mr-1' />
                      {totalLessons} lessons
                    </span>
                    <Badge variant='secondary' className='text-xs'>
                      {course.category}
                    </Badge>
                  </div>
                </div>

                <div className='text-right shrink-0'>
                  <div className='text-2xl font-bold text-gray-900'>
                    {formatPrice(course.price)}
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={`/${user?.role}/course/${course._id}`} className={cn('block group', className)}>
        <div className='flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors'>
          <div className='relative w-20 h-14 shrink-0 rounded-lg overflow-hidden bg-gray-200'>
            {course.thumbnail ? (
              <Image src={course.thumbnail} alt={course.title} fill className='object-cover' />
            ) : (
              <div className='absolute inset-0 bg-linear-to-br from-blue-500 to-purple-600' />
            )}
          </div>
          <div className='flex-1 min-w-0'>
            <h4 className='font-semibold text-sm text-gray-900 line-clamp-1 group-hover:text-blue-600'>
              {course.title}
            </h4>
            <p className='text-xs text-gray-500'>{course.instructor}</p>
          </div>
          <div className='text-right shrink-0'>
            <div className='font-bold text-gray-900'>{formatPrice(course.price)}</div>
          </div>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={`/${user?.role}/course/${course._id}`} className={cn('block group', className)}>
      <Card className='overflow-hidden hover-lift border-0 shadow-md hover:shadow-xl transition-all duration-300'>
        <div className='relative h-[180px] bg-gray-200'>
          {course.thumbnail ? (
            <Image src={course.thumbnail} alt={course.title} fill className='object-cover' />
          ) : (
            <div className='absolute inset-0 bg-linear-to-br from-blue-500 to-purple-600' />
          )}
          <div className='absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center'>
            <div className='w-14 h-14 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100'>
              <Play className='w-6 h-6 text-blue-600 ml-1' fill='currentColor' />
            </div>
          </div>
          <Badge className='absolute top-3 left-3 bg-white/90 text-gray-800 backdrop-blur-sm'>
            {course.category}
          </Badge>
        </div>

        <CardContent className='p-4'>
          <h3 className='font-bold text-gray-900 mb-1 line-clamp-2 min-h-12 group-hover:text-blue-600 transition-colors'>
            {course.title}
          </h3>
          <p className='text-sm text-gray-500 mb-2'>{course.instructor}</p>

          <div className='flex items-center space-x-1 mb-2'>
            <span className='font-bold text-amber-700'>{rating.toFixed(1)}</span>
            <Rating value={rating} size='sm' />
            <span className='text-xs text-gray-500'>({reviewCount.toLocaleString()} reviews)</span>
          </div>

          <div className='flex items-center space-x-3 text-xs text-gray-500 mb-3'>
            <span className='flex items-center'>
              <Clock className='w-3.5 h-3.5 mr-1' />
              {formatDuration(totalDuration)}
            </span>
            <span className='flex items-center'>
              <Play className='w-3.5 h-3.5 mr-1' />
              {totalLessons} lessons
            </span>
          </div>

          {showProgress ? (
            <div>
              <div className='flex items-center justify-between mb-1 text-xs'>
                <span className='text-gray-600'>Progress</span>
                <span className='font-semibold text-blue-600'>{progress}%</span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-1.5'>
                <div
                  className='bg-blue-600 h-1.5 rounded-full transition-all'
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className='flex items-center justify-between pt-3 border-t'>
              <div className='flex items-center space-x-1 text-xs text-gray-500'>
                <Users className='w-3.5 h-3.5' />
                <span>{course.totalEnrollments.toLocaleString()}</span>
              </div>
              <span className='text-xl font-bold text-gray-900'>{formatPrice(course.price)}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default CourseCard;
