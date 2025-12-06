'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Users, GraduationCap, TrendingUp, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { fetchAnalytics } from '@/redux/features/adminSlice';
import Loading from '@/app/loading';

const AdminDashboard = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { analytics, isLoading } = useAppSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAnalytics(undefined));
  }, [dispatch]);

  if (isLoading) {
    return <Loading />;
  }

  const stats = [
    {
      title: 'Total Courses',
      value: analytics?.overview.totalCourses || 0,
      icon: BookOpen,
      color: 'bg-blue-100 text-blue-600',
      href: '/admin/course',
    },
    {
      title: 'Total Students',
      value: analytics?.overview.totalStudents || 0,
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
      href: '/admin/students',
    },
    {
      title: 'Total Enrollments',
      value: analytics?.overview.totalEnrollments || 0,
      icon: GraduationCap,
      color: 'bg-green-100 text-green-600',
      href: '/admin/analytics',
    },
    {
      title: 'Active Courses',
      value: analytics?.overview.totalCourses || 0,
      icon: TrendingUp,
      color: 'bg-orange-100 text-orange-600',
      href: '/admin/course',
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Welcome Section */}
      <div className='bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white'>
        <h1 className='text-3xl font-bold mb-2'>Admin Dashboard</h1>
        <p className='text-blue-100'>Manage courses, students, and track platform analytics</p>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {stats.map((stat, index) => (
          <Card
            key={index}
            className='hover:shadow-lg transition-shadow cursor-pointer'
            onClick={() => router.push(stat.href)}
          >
            <CardContent className='p-6'>
              <div className='flex items-center justify-between mb-4'>
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}
                >
                  <stat.icon className='w-6 h-6' />
                </div>
              </div>
              <h3 className='text-3xl font-bold text-gray-900 mb-1'>{stat.value}</h3>
              <p className='text-sm text-gray-600'>{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <Card className='hover:shadow-lg transition-shadow'>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <BookOpen className='w-5 h-5 mr-2 text-blue-600' />
              Manage Courses
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <p className='text-sm text-gray-600 mb-4'>Create, edit, and manage course content</p>
            <Button className='w-full' onClick={() => router.push('/admin/course')}>
              Go to Courses
              <ChevronRight className='w-4 h-4 ml-1' />
            </Button>
          </CardContent>
        </Card>

        <Card className='hover:shadow-lg transition-shadow'>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Users className='w-5 h-5 mr-2 text-purple-600' />
              Student Management
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <p className='text-sm text-gray-600 mb-4'>View and manage student enrollments</p>
            <Button className='w-full' onClick={() => router.push('/admin/students')}>
              View Students
              <ChevronRight className='w-4 h-4 ml-1' />
            </Button>
          </CardContent>
        </Card>

        <Card className='hover:shadow-lg transition-shadow'>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <TrendingUp className='w-5 h-5 mr-2 text-green-600' />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <p className='text-sm text-gray-600 mb-4'>View detailed platform analytics</p>
            <Button className='w-full' onClick={() => router.push('/admin/analytics')}>
              View Analytics
              <ChevronRight className='w-4 h-4 ml-1' />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Courses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          {analytics?.coursesByCategory && analytics.coursesByCategory.length > 0 ? (
            <div className='space-y-4'>
              {analytics.coursesByCategory.map((category, index) => (
                <div key={index} className='flex items-center justify-between'>
                  <div className='flex-1'>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='font-medium text-gray-900'>{category._id}</span>
                      <span className='text-sm text-gray-600'>{category.count} courses</span>
                    </div>
                    <div className='w-full bg-gray-200 rounded-full h-2'>
                      <div
                        className='bg-blue-600 h-2 rounded-full'
                        style={{
                          width: `${(category.count / analytics.overview.totalCourses) * 100}%`,
                        }}
                      />
                    </div>
                    <div className='flex items-center justify-between mt-1 text-xs text-gray-500'>
                      <span>Avg Price: ${category.avgPrice.toFixed(2)}</span>
                      <span>{category.totalEnrollments} enrollments</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-gray-600 text-center py-8'>No data available</p>
          )}
        </CardContent>
      </Card>

      {/* Enrollment Trends */}
      {analytics?.enrollmentTrends && analytics.enrollmentTrends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Enrollment Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {analytics.enrollmentTrends.slice(0, 5).map((trend, index) => (
                <div key={index} className='flex items-center justify-between'>
                  <span className='text-gray-700'>
                    {new Date(trend._id.year, trend._id.month - 1).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </span>
                  <span className='font-semibold text-blue-600'>{trend.count} enrollments</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;
