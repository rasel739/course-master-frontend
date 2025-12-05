'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Clock, Play, Loader2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Course } from '@/types';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { fetchDashboard } from '@/redux/features/enrollmentSlice';
import { formatDate } from '@/utils';

const Enrollment = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { enrollments, isLoading } = useAppSelector((state) => state.enrollment);
  console.log(enrollments);
  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <Loader2 className='w-8 h-8 animate-spin text-blue-600' />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>My Enrollments</h1>
        <p className='text-gray-600 mt-2'>Track your progress across all enrolled courses</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                <BookOpen className='w-6 h-6 text-blue-600' />
              </div>
            </div>
            <h3 className='text-2xl font-bold text-gray-900 mb-1'>{enrollments?.length}</h3>
            <p className='text-sm text-gray-600'>Total Enrollments</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center'>
                <TrendingUp className='w-6 h-6 text-purple-600' />
              </div>
            </div>
            <h3 className='text-2xl font-bold text-gray-900 mb-1'>
              {enrollments?.filter((e) => e.progress > 0 && e.progress < 100).length}
            </h3>
            <p className='text-sm text-gray-600'>In Progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
                <Clock className='w-6 h-6 text-green-600' />
              </div>
            </div>
            <h3 className='text-2xl font-bold text-gray-900 mb-1'>
              {enrollments?.filter((e) => e.progress === 100).length}
            </h3>
            <p className='text-sm text-gray-600'>Completed</p>
          </CardContent>
        </Card>
      </div>

      {enrollments?.length === 0 ? (
        <Card>
          <CardContent className='p-12 text-center'>
            <BookOpen className='w-16 h-16 text-gray-400 mx-auto mb-4' />
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>No Enrollments Yet</h3>
            <p className='text-gray-600 mb-6'>Start learning by enrolling in a course</p>
            <Button onClick={() => router.push('/courses')}>Browse Courses</Button>
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-4'>
          {enrollments?.map((enrollment) => {
            const course = enrollment.course as Course;
            const progressColor =
              enrollment?.progress === 100
                ? 'bg-green-600'
                : enrollment.progress > 0
                ? 'bg-blue-600'
                : 'bg-gray-300';

            return (
              <Card
                key={enrollment._id}
                className='hover:shadow-lg transition-shadow cursor-pointer'
                onClick={() => router.push(`/enrollments/${enrollment?._id}`)}
              >
                <CardContent className='p-6'>
                  <div className='flex flex-col md:flex-row md:items-center gap-6'>
                    <div className='w-full md:w-48 h-32 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg shrink-0 relative overflow-hidden'>
                      <div className='absolute inset-0 bg-black/20' />
                      <div className='absolute bottom-3 left-3'>
                        <span className='bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium'>
                          {course.category}
                        </span>
                      </div>
                    </div>

                    <div className='flex-1 space-y-4'>
                      <div>
                        <h3 className='text-xl font-bold text-gray-900 mb-2'>{course.title}</h3>
                        <p className='text-sm text-gray-600'>Instructor: {course.instructor}</p>
                      </div>

                      <div>
                        <div className='flex items-center justify-between mb-2'>
                          <span className='text-sm text-gray-600'>Progress</span>
                          <span className='text-sm font-semibold text-blue-600'>
                            {enrollment.progress}%
                          </span>
                        </div>
                        <div className='w-full bg-gray-200 rounded-full h-2'>
                          <div
                            className={`${progressColor} h-2 rounded-full transition-all`}
                            style={{ width: `${enrollment.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className='flex flex-wrap gap-4 text-sm text-gray-600'>
                        <div className='flex items-center'>
                          <Clock className='w-4 h-4 mr-1' />
                          Enrolled: {formatDate(enrollment.enrolledAt)}
                        </div>
                        <div className='flex items-center'>
                          <Play className='w-4 h-4 mr-1' />
                          {enrollment.completedLessons.length} lessons completed
                        </div>
                      </div>

                      <div>
                        <Button size='sm' className='group'>
                          <Play className='w-4 h-4 mr-2 group-hover:scale-110 transition-transform' />
                          {enrollment?.progress === 100 ? 'Review Course' : 'Continue Learning'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Enrollment;
