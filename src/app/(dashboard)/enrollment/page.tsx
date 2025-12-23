'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Clock, Play, TrendingUp, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Course } from '@/types';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { fetchDashboard } from '@/redux/features/enrollmentSlice';
import { formatDate } from '@/utils';
import Loading from '@/app/loading';

const Enrollment = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { enrollments, isLoading } = useAppSelector((state) => state.enrollment);
  console.log(enrollments);
  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='space-y-4 sm:space-y-6'>
      <div>
        <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>My Enrollments</h1>
        <p className='text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base'>Track your learning progress</p>
      </div>

      {/* Stats Overview */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6'>
        <Card>
          <CardContent className='p-4 sm:p-6'>
            <div className='flex items-center space-x-3 sm:space-x-4'>
              <div className='p-2 sm:p-3 bg-blue-100 rounded-lg sm:rounded-xl'>
                <BookOpen className='w-5 h-5 sm:w-6 sm:h-6 text-blue-600' />
              </div>
              <div>
                <p className='text-xs sm:text-sm text-gray-600'>Total Enrollments</p>
                <p className='text-xl sm:text-2xl font-bold text-gray-900'>{enrollments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4 sm:p-6'>
            <div className='flex items-center space-x-3 sm:space-x-4'>
              <div className='p-2 sm:p-3 bg-yellow-100 rounded-lg sm:rounded-xl'>
                <Clock className='w-5 h-5 sm:w-6 sm:h-6 text-yellow-600' />
              </div>
              <div>
                <p className='text-xs sm:text-sm text-gray-600'>In Progress</p>
                <p className='text-xl sm:text-2xl font-bold text-gray-900'>
                  {enrollments.filter((e) => e.progress < 100).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4 sm:p-6'>
            <div className='flex items-center space-x-3 sm:space-x-4'>
              <div className='p-2 sm:p-3 bg-green-100 rounded-lg sm:rounded-xl'>
                <Award className='w-5 h-5 sm:w-6 sm:h-6 text-green-600' />
              </div>
              <div>
                <p className='text-xs sm:text-sm text-gray-600'>Completed</p>
                <p className='text-xl sm:text-2xl font-bold text-gray-900'>
                  {enrollments.filter((e) => e.progress === 100).length}
                </p>
              </div>
            </div>
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
                onClick={() => router.push(`/enrollment/${enrollment?._id}`)}
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
