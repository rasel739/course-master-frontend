'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, TrendingUp, Award, Clock, Play, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { Course } from '@/types';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { fetchDashboard } from '@/redux/features/enrollmentSlice';
import Loading from '@/app/loading';
import Image from 'next/image';

const Dashboard = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { enrollments, isLoading } = useAppSelector((state) => state.enrollment);

  useEffect(() => {
    if (user && isAuthenticated) {
      dispatch(fetchDashboard());
    }
  }, [dispatch, user, isAuthenticated]);

  const stats = [
    {
      title: 'Enrolled Courses',
      value: enrollments?.length,
      icon: BookOpen,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'In Progress',
      value: enrollments?.filter((e) => e.progress > 0 && e.progress < 100).length,
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Completed',
      value: enrollments?.filter((e) => e.progress === 100).length,
      icon: Award,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Total Progress',
      value:
        enrollments?.length > 0
          ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length) +
          '%'
          : '0%',
      icon: Clock,
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='space-y-6'>
      {/* Welcome Section */}
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>Welcome back, {user?.name}! 👋</h1>
        <p className='text-gray-600 mt-2'>{"Here's your learning progress overview"}</p>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {stats?.map((stat, index) => (
          <Card key={index}>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between mb-4'>
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}
                >
                  <stat.icon className='w-6 h-6' />
                </div>
              </div>
              <h3 className='text-2xl font-bold text-gray-900 mb-1'>{stat.value}</h3>
              <p className='text-sm text-gray-600'>{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Continue Learning */}
      {enrollments?.length > 0 ? (
        <div>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-2xl font-bold text-gray-900'>Continue Learning</h2>
            <Link href='/enrollment'>
              <Button variant='ghost' size='sm'>
                View All
                <ChevronRight className='w-4 h-4 ml-1' />
              </Button>
            </Link>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {enrollments.slice(0, 3).map((enrollment) => {
              const course = enrollment.course as Course;
              return (
                <Card
                  key={enrollment._id}
                  className='hover:shadow-lg transition-shadow cursor-pointer'
                  onClick={() => router.push(`/enrollment/${enrollment._id}`)}
                >
                  <div className='relative h-48 bg-linear-to-br from-blue-500 to-purple-600 rounded-t-lg'>
                    <Image src={`${course?.thumbnail}`} alt='course-image' fill />
                    <div className='absolute inset-0 bg-black/20' />
                    <div className='absolute bottom-4 left-4 right-4'>
                      <span className='bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-800'>
                        {course.category}
                      </span>
                    </div>
                  </div>
                  <CardContent className='p-6'>
                    <h3 className='text-lg font-bold text-gray-900 mb-2 line-clamp-2'>
                      {course.title}
                    </h3>
                    <p className='text-sm text-gray-600 mb-4'>{course.instructor}</p>

                    {/* Progress Bar */}
                    <div className='mb-4'>
                      <div className='flex items-center justify-between mb-2'>
                        <span className='text-sm text-gray-600'>Progress</span>
                        <span className='text-sm font-semibold text-blue-600'>
                          {enrollment.progress}%
                        </span>
                      </div>
                      <div className='w-full bg-gray-200 rounded-full h-2'>
                        <div
                          className='bg-blue-600 h-2 rounded-full transition-all'
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                    </div>

                    <Button className='w-full group'>
                      <Play className='w-4 h-4 mr-2 group-hover:scale-110 transition-transform' />
                      Continue Learning
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className='p-12 text-center'>
            <BookOpen className='w-16 h-16 text-gray-400 mx-auto mb-4' />
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>No Enrolled Courses</h3>
            <p className='text-gray-600 mb-6'>
              Start your learning journey by enrolling in a course
            </p>
            <Link href='/courses'>
              <Button>
                Browse Courses
                <ChevronRight className='w-4 h-4 ml-1' />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>Quick Actions</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <Link href='/courses'>
            <Card className='hover:shadow-md transition-shadow cursor-pointer'>
              <CardContent className='p-6 flex items-center space-x-4'>
                <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                  <BookOpen className='w-6 h-6 text-blue-600' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900'>Browse Courses</h3>
                  <p className='text-sm text-gray-600'>Explore new courses</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href='/enrollment'>
            <Card className='hover:shadow-md transition-shadow cursor-pointer'>
              <CardContent className='p-6 flex items-center space-x-4'>
                <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center'>
                  <TrendingUp className='w-6 h-6 text-purple-600' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900'>My Progress</h3>
                  <p className='text-sm text-gray-600'>Track your learning</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className='hover:shadow-md transition-shadow cursor-pointer'>
            <CardContent className='p-6 flex items-center space-x-4'>
              <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
                <Award className='w-6 h-6 text-green-600' />
              </div>
              <div>
                <h3 className='font-semibold text-gray-900'>Certificates</h3>
                <p className='text-sm text-gray-600'>View achievements</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
