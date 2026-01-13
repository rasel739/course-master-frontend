'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { ChevronLeft, ChevronRight, Users, Clock, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rating } from '@/components/ui/rating';
import { courseApi } from '@/helpers/axios/api';
import { Course } from '@/types';

export const FeaturedCourses = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseApi.getCourses({ limit: 6 });
        const coursesData = response.data.data?.courses || [];
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    checkScroll();
  }, [courses]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 300);
    }
  };

  // Calculate total duration from modules
  const getTotalDuration = (course: Course) => {
    const totalMinutes =
      course.modules?.reduce(
        (sum, module) =>
          sum +
          (module.lessons?.reduce((lessonSum, lesson) => lessonSum + (lesson.duration || 0), 0) ||
            0),
        0
      ) || 0;
    const hours = Math.floor(totalMinutes / 60);
    return hours > 0 ? `${hours} hours` : `${totalMinutes} mins`;
  };

  if (isLoading) {
    return (
      <section className='py-10 sm:py-12 md:py-16 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center justify-center h-48'>
            <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
          </div>
        </div>
      </section>
    );
  }

  if (courses.length === 0) {
    return null;
  }

  return (
    <section className='py-10 sm:py-12 md:py-16 bg-white'>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8'>
          <div>
            <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2'>
              Featured Courses
            </h2>
            <p className='text-gray-600 text-sm sm:text-base'>
              Learn from the best instructors worldwide
            </p>
          </div>
          {/* Desktop scroll buttons */}
          <div className='hidden sm:flex items-center space-x-2'>
            <Button
              variant='outline'
              size='icon'
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className='rounded-full w-9 h-9 sm:w-10 sm:h-10'
            >
              <ChevronLeft className='w-4 h-4 sm:w-5 sm:h-5' />
            </Button>
            <Button
              variant='outline'
              size='icon'
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className='rounded-full w-9 h-9 sm:w-10 sm:h-10'
            >
              <ChevronRight className='w-4 h-4 sm:w-5 sm:h-5' />
            </Button>
          </div>
        </div>

        {/* Courses Carousel */}
        <div
          ref={scrollRef}
          className='flex space-x-4 sm:space-x-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory'
          onScroll={checkScroll}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {courses.map((course) => (
            <Link
              href={`/course/${course._id}`}
              key={course._id}
              className='shrink-0 w-[260px] sm:w-[280px] md:w-[320px] group snap-start'
            >
              <Card className='overflow-hidden hover-lift border-0 shadow-md hover:shadow-xl transition-all duration-300'>
                <div className='relative h-[140px] sm:h-40 md:h-[180px] bg-gray-200'>
                  {course.thumbnail ? (
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className='object-cover'
                    />
                  ) : (
                    <div className='absolute inset-0 bg-linear-to-br from-blue-500/20 to-purple-600/20' />
                  )}
                  {course.totalEnrollments > 100 && (
                    <Badge className='absolute top-2 left-2 sm:top-3 sm:left-3 bg-yellow-500 text-black font-bold text-xs'>
                      Popular
                    </Badge>
                  )}
                  <div className='absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center'>
                    <div className='w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100'>
                      <Play
                        className='w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600 ml-0.5'
                        fill='currentColor'
                      />
                    </div>
                  </div>
                </div>

                <CardContent className='p-3 sm:p-4'>
                  <h3 className='font-bold text-sm sm:text-base text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors min-h-10 sm:min-h-12'>
                    {course.title}
                  </h3>
                  <p className='text-xs sm:text-sm text-gray-500 mb-2'>
                    {course.instructor || 'Instructor'}
                  </p>

                  <div className='flex items-center space-x-1 mb-2'>
                    <span className='font-bold text-amber-700 text-xs sm:text-sm'>4.5</span>
                    <Rating value={4.5} size='sm' />
                    <span className='text-xs text-gray-500'>
                      ({course.totalEnrollments?.toLocaleString() || 0})
                    </span>
                  </div>

                  <div className='flex items-center space-x-2 sm:space-x-3 text-xs text-gray-500 mb-2 sm:mb-3'>
                    <span className='flex items-center'>
                      <Clock className='w-3 h-3 sm:w-3.5 sm:h-3.5 mr-0.5 sm:mr-1' />
                      {getTotalDuration(course)}
                    </span>
                    <span className='flex items-center'>
                      <Users className='w-3 h-3 sm:w-3.5 sm:h-3.5 mr-0.5 sm:mr-1' />
                      {(course.totalEnrollments || 0).toLocaleString()}
                    </span>
                  </div>

                  <div className='flex items-center space-x-2'>
                    <span className='text-lg sm:text-xl font-bold text-gray-900'>
                      ${course.price || 0}
                    </span>
                    {course.price && course.price < 100 && (
                      <span className='text-xs sm:text-sm text-gray-500 line-through'>
                        ${Math.round((course.price || 0) * 1.8)}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className='text-center mt-6 sm:mt-8'>
          <Link href='/course'>
            <Button size='lg' variant='outline' className='px-6 sm:px-8 text-sm sm:text-base'>
              View All Courses
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
