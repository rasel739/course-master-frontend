'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Users, GraduationCap, TrendingUp, Loader2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { fetchAnalytics } from '@/redux/features/adminSlice';

export default function AdminAnalyticsPage() {
  const dispatch = useAppDispatch();
  const { analytics, isLoading } = useAppSelector((state) => state.admin);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    // Calculate date range
    let startDate: string | undefined;
    const endDate = new Date().toISOString().split('T')[0];

    if (dateRange !== 'all') {
      const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
      const date = new Date();
      date.setDate(date.getDate() - days);
      startDate = date.toISOString().split('T')[0];
    }

    dispatch(fetchAnalytics({ startDate, endDate }));
  }, [dispatch, dateRange]);

  const exportData = () => {
    if (!analytics) return;

    const data = JSON.stringify(analytics, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString()}.json`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <Loader2 className='w-8 h-8 animate-spin text-blue-600' />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Analytics Dashboard</h1>
          <p className='text-gray-600 mt-2'>Platform insights and performance metrics</p>
        </div>
        <div className='flex items-center space-x-2'>
          <select
            className='h-10 rounded-md border border-gray-300 bg-white px-3 text-sm'
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as '7d' | '30d' | '90d' | 'all')}
          >
            <option value='7d'>Last 7 days</option>
            <option value='30d'>Last 30 days</option>
            <option value='90d'>Last 90 days</option>
            <option value='all'>All time</option>
          </select>
          <Button variant='outline' size='sm' onClick={exportData}>
            <Download className='w-4 h-4 mr-2' />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                <BookOpen className='w-6 h-6 text-blue-600' />
              </div>
            </div>
            <h3 className='text-3xl font-bold text-gray-900 mb-1'>
              {analytics?.overview.totalCourses || 0}
            </h3>
            <p className='text-sm text-gray-600'>Total Courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center'>
                <Users className='w-6 h-6 text-purple-600' />
              </div>
            </div>
            <h3 className='text-3xl font-bold text-gray-900 mb-1'>
              {analytics?.overview.totalStudents || 0}
            </h3>
            <p className='text-sm text-gray-600'>Total Students</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
                <GraduationCap className='w-6 h-6 text-green-600' />
              </div>
            </div>
            <h3 className='text-3xl font-bold text-gray-900 mb-1'>
              {analytics?.overview.totalEnrollments || 0}
            </h3>
            <p className='text-sm text-gray-600'>Total Enrollments</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center'>
                <TrendingUp className='w-6 h-6 text-orange-600' />
              </div>
            </div>
            <h3 className='text-3xl font-bold text-gray-900 mb-1'>
              {analytics?.overview.totalCourses
                ? Math.round(analytics.overview.totalEnrollments / analytics.overview.totalCourses)
                : 0}
            </h3>
            <p className='text-sm text-gray-600'>Avg Enrollments/Course</p>
          </CardContent>
        </Card>
      </div>

      {/* Enrollment Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Enrollment Trends</CardTitle>
        </CardHeader>
        <CardContent>
          {analytics?.enrollmentTrends && analytics.enrollmentTrends.length > 0 ? (
            <div className='space-y-4'>
              {analytics.enrollmentTrends.map((trend, index) => {
                const maxCount = Math.max(...analytics.enrollmentTrends.map((t) => t.count));
                const width = (trend.count / maxCount) * 100;

                return (
                  <div key={index} className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium text-gray-700'>
                        {new Date(trend._id.year, trend._id.month - 1).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                        })}
                      </span>
                      <span className='text-sm font-bold text-blue-600'>
                        {trend.count} enrollments
                      </span>
                    </div>
                    <div className='w-full bg-gray-200 rounded-full h-3'>
                      <div
                        className='bg-blue-600 h-3 rounded-full transition-all'
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className='text-center py-8 text-gray-500'>No enrollment data available</p>
          )}
        </CardContent>
      </Card>

      {/* Courses by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Courses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          {analytics?.coursesByCategory && analytics.coursesByCategory.length > 0 ? (
            <div className='space-y-6'>
              {analytics.coursesByCategory.map((category, index) => (
                <div key={index} className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h4 className='font-semibold text-gray-900'>{category._id}</h4>
                      <p className='text-sm text-gray-600'>
                        {category.count} courses • {category.totalEnrollments} enrollments
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='text-lg font-bold text-blue-600'>
                        ${category.avgPrice.toFixed(2)}
                      </p>
                      <p className='text-xs text-gray-500'>Avg Price</p>
                    </div>
                  </div>
                  <div className='grid grid-cols-3 gap-4 text-center'>
                    <div className='bg-blue-50 rounded-lg p-3'>
                      <p className='text-2xl font-bold text-blue-600'>{category.count}</p>
                      <p className='text-xs text-gray-600'>Courses</p>
                    </div>
                    <div className='bg-purple-50 rounded-lg p-3'>
                      <p className='text-2xl font-bold text-purple-600'>
                        {category.totalEnrollments}
                      </p>
                      <p className='text-xs text-gray-600'>Enrollments</p>
                    </div>
                    <div className='bg-green-50 rounded-lg p-3'>
                      <p className='text-2xl font-bold text-green-600'>
                        {Math.round(category.totalEnrollments / category.count)}
                      </p>
                      <p className='text-xs text-gray-600'>Avg/Course</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-center py-8 text-gray-500'>No category data available</p>
          )}
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics?.coursesByCategory ? (
              <div className='space-y-3'>
                {analytics.coursesByCategory
                  .map((item) => ({ ...item }))
                  .sort((a, b) => b.totalEnrollments - a.totalEnrollments)
                  .slice(0, 5)
                  .map((category, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
                    >
                      <div className='flex items-center space-x-3'>
                        <div className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm'>
                          {index + 1}
                        </div>
                        <span className='font-medium text-gray-900'>{category._id}</span>
                      </div>
                      <span className='text-sm font-semibold text-blue-600'>
                        {category.totalEnrollments} enrollments
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className='text-center py-8 text-gray-500'>No data available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics?.coursesByCategory ? (
              <div className='space-y-3'>
                {[...analytics.coursesByCategory]
                  .map((cat) => ({
                    ...cat,
                    revenue: cat.avgPrice * cat.totalEnrollments,
                  }))
                  .sort((a, b) => b.revenue - a.revenue)
                  .slice(0, 5)
                  .map((category, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
                    >
                      <div className='flex items-center space-x-3'>
                        <div className='w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm'>
                          {index + 1}
                        </div>
                        <span className='font-medium text-gray-900'>{category._id}</span>
                      </div>
                      <span className='text-sm font-semibold text-green-600'>
                        ${category.revenue.toFixed(2)}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className='text-center py-8 text-gray-500'>No data available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
