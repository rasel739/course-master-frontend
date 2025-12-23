'use client';

import { Play, Award, Users, Star } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/utils';

interface InstructorCardProps {
  name: string;
  title?: string;
  avatar?: string;
  bio?: string;
  rating?: number;
  reviewCount?: number;
  studentCount?: number;
  courseCount?: number;
  className?: string;
}

export const InstructorCard = ({
  name,
  title = 'Expert Instructor',
  avatar,
  bio,
  rating = 4.8,
  reviewCount = 5000,
  studentCount = 25000,
  courseCount = 8,
  className,
}: InstructorCardProps) => {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className='p-6'>
        <h3 className='text-lg font-bold text-gray-900 mb-4'>Instructor</h3>

        <div className='flex items-start space-x-4 mb-4'>
          <Avatar size='xl' src={avatar} fallback={name} className='ring-2 ring-blue-100' />
          <div className='flex-1'>
            <h4 className='font-bold text-blue-600 hover:underline cursor-pointer text-lg'>
              {name}
            </h4>
            <p className='text-gray-600 text-sm'>{title}</p>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4 mb-4'>
          <div className='flex items-center space-x-2'>
            <Star className='w-4 h-4 text-yellow-500' fill='currentColor' />
            <span className='text-sm'>
              <span className='font-semibold'>{rating}</span> Instructor Rating
            </span>
          </div>
          <div className='flex items-center space-x-2'>
            <Award className='w-4 h-4 text-gray-500' />
            <span className='text-sm'>
              <span className='font-semibold'>{reviewCount.toLocaleString()}</span> Reviews
            </span>
          </div>
          <div className='flex items-center space-x-2'>
            <Users className='w-4 h-4 text-gray-500' />
            <span className='text-sm'>
              <span className='font-semibold'>{studentCount.toLocaleString()}</span> Students
            </span>
          </div>
          <div className='flex items-center space-x-2'>
            <Play className='w-4 h-4 text-gray-500' />
            <span className='text-sm'>
              <span className='font-semibold'>{courseCount}</span> Courses
            </span>
          </div>
        </div>

        {bio && <p className='text-gray-600 text-sm leading-relaxed'>{bio}</p>}
      </CardContent>
    </Card>
  );
};

export default InstructorCard;
