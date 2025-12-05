'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  Loader2,
  Clock,
  Play,
  Users,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { fetchCourses, setFilters } from '@/redux/features/courseSlice';
import { debounce, formatDuration, formatPrice } from '@/utils';
import { categories } from '@/constants';

const Course = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { courses, pagination, isLoading, filters } = useAppSelector((state) => state.course);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchCourses(filters));
  }, [dispatch, filters]);

  const handleSearch = debounce((value: string) => {
    dispatch(setFilters({ search: value, page: 1 }));
  }, 500);

  const handleCategoryChange = (category: string) => {
    dispatch(
      setFilters({
        category: filters.category === category ? undefined : category,
        page: 1,
      })
    );
  };

  const handlePageChange = (page: number) => {
    dispatch(setFilters({ page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>Explore Courses</h1>
        <p className='text-gray-600 mt-2'>Discover courses from expert instructors</p>
      </div>

      {/* Search and Filters */}
      <div className='space-y-4'>
        {/* Search Bar */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
          <Input
            type='text'
            placeholder='Search courses...'
            className='pl-10'
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleSearch(e.target.value);
            }}
          />
        </div>

        {/* Category Filters */}
        <div className='flex items-center space-x-2 overflow-x-auto pb-2'>
          <Filter className='w-5 h-5 text-gray-600 shrink-0' />
          <Button
            variant={!filters.category ? 'default' : 'outline'}
            size='sm'
            onClick={() => dispatch(setFilters({ category: undefined, page: 1 }))}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={filters.category === category ? 'default' : 'outline'}
              size='sm'
              onClick={() => handleCategoryChange(category)}
              className='whitespace-nowrap'
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      {pagination && (
        <div className='text-sm text-gray-600'>
          Showing {courses.length} of {pagination.totalCourses} courses
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className='flex items-center justify-center h-96'>
          <Loader2 className='w-8 h-8 animate-spin text-blue-600' />
        </div>
      ) : courses.length === 0 ? (
        <Card>
          <CardContent className='p-12 text-center'>
            <Search className='w-16 h-16 text-gray-400 mx-auto mb-4' />
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>No Courses Found</h3>
            <p className='text-gray-600'>Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Courses Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {courses.map((course) => (
              <Card
                key={course._id}
                className='hover:shadow-xl transition-all cursor-pointer group'
                onClick={() => router.push(`/course/${course._id}`)}
              >
                <div className='relative h-48 bg-linear-to-br from-blue-500 to-purple-600 overflow-hidden rounded-t-lg'>
                  <div className='absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all' />
                  <div className='absolute bottom-4 left-4 right-4'>
                    <span className='bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-800'>
                      {course.category}
                    </span>
                  </div>
                </div>

                <CardContent className='p-6'>
                  <h3 className='text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2'>
                    {course.title}
                  </h3>

                  <p className='text-gray-600 text-sm mb-4 line-clamp-2'>{course.description}</p>

                  <div className='flex items-center justify-between mb-4 text-sm text-gray-500'>
                    <span className='flex items-center'>
                      <Play className='w-4 h-4 mr-1' />
                      {course.totalLessons ||
                        course.modules.reduce((sum, m) => sum + m.lessons.length, 0)}{' '}
                      lessons
                    </span>
                    <span className='flex items-center'>
                      <Clock className='w-4 h-4 mr-1' />
                      {formatDuration(
                        course.totalDuration ||
                          course.modules.reduce(
                            (sum, m) => sum + m.lessons.reduce((s, l) => s + l.duration, 0),
                            0
                          )
                      )}
                    </span>
                  </div>

                  <div className='flex items-center justify-between pt-4 border-t'>
                    <div className='flex items-center space-x-2'>
                      <Users className='w-4 h-4 text-gray-400' />
                      <span className='text-sm text-gray-600'>
                        {course.totalEnrollments} enrolled
                      </span>
                    </div>
                    <span className='text-2xl font-bold text-blue-600'>
                      {formatPrice(course.price)}
                    </span>
                  </div>

                  <Button className='w-full mt-4 group'>
                    View Details
                    <ChevronRight className='w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform' />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className='flex items-center justify-center space-x-2'>
              <Button
                variant='outline'
                size='sm'
                disabled={!pagination.hasPrev}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
              >
                <ChevronLeft className='w-4 h-4' />
                Previous
              </Button>

              <div className='flex items-center space-x-1'>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === pagination.totalPages ||
                      Math.abs(page - pagination.currentPage) <= 1
                  )
                  .map((page, index, array) => (
                    <div key={page} className='flex items-center'>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className='px-2 text-gray-400'>...</span>
                      )}
                      <Button
                        variant={page === pagination.currentPage ? 'default' : 'outline'}
                        size='sm'
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    </div>
                  ))}
              </div>

              <Button
                variant='outline'
                size='sm'
                disabled={!pagination.hasNext}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
              >
                Next
                <ChevronRight className='w-4 h-4' />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Course;
