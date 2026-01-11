'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Eye, UserCheck, GraduationCap, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate, getInitials } from '@/utils';
import { Course, User } from '@/types';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { fetchAllEnrollments } from '@/redux/features/adminSlice';
import { fetchCourses } from '@/redux/features/courseSlice';
import Loading from '@/app/loading';

const AdminStudents = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { enrollments, isLoading } = useAppSelector((state) => state.admin);
  const { courses } = useAppSelector((state) => state.course);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');

  useEffect(() => {
    dispatch(fetchAllEnrollments());
    dispatch(fetchCourses({}));
  }, [dispatch]);

  const filteredEnrollments = enrollments.filter((enrollment) => {
    const user = enrollment.user as User;
    const course = enrollment.course as Course;
    const matchesSearch =
      user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course?.title?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCourse = selectedCourse === 'all' || course?._id === selectedCourse;

    return matchesSearch && matchesCourse;
  });

  const totalStudents = new Set(
    enrollments.map((e) => (typeof e.user === 'object' ? e.user._id : e.user))
  ).size;
  const totalEnrollments = enrollments.length;
  const activeStudents = enrollments.filter((e) => e.progress > 0 && e.progress < 100).length;
  const avgProgress =
    enrollments.length > 0
      ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
      : 0;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>Student Management</h1>
        <p className='text-gray-600 mt-2'>View and manage all student enrollments</p>
      </div>

      {/* Statistics */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                <UserCheck className='w-6 h-6 text-blue-600' />
              </div>
            </div>
            <h3 className='text-3xl font-bold text-gray-900 mb-1'>{totalStudents}</h3>
            <p className='text-sm text-gray-600'>Total Students</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center'>
                <GraduationCap className='w-6 h-6 text-purple-600' />
              </div>
            </div>
            <h3 className='text-3xl font-bold text-gray-900 mb-1'>{totalEnrollments}</h3>
            <p className='text-sm text-gray-600'>Total Enrollments</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
                <TrendingUp className='w-6 h-6 text-green-600' />
              </div>
            </div>
            <h3 className='text-3xl font-bold text-gray-900 mb-1'>{activeStudents}</h3>
            <p className='text-sm text-gray-600'>Active Students</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center'>
                <TrendingUp className='w-6 h-6 text-orange-600' />
              </div>
            </div>
            <h3 className='text-3xl font-bold text-gray-900 mb-1'>{avgProgress}%</h3>
            <p className='text-sm text-gray-600'>Average Progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
          <Input
            type='text'
            placeholder='Search by student name, email, or course...'
            className='pl-10'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className='flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm'
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value='all'>All Courses</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      {/* Students Table */}
      <Card>
        <CardContent className='p-0'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 border-b'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Student
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Course
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Progress
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Enrolled Date
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Lessons Completed
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredEnrollments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className='px-6 py-12 text-center text-gray-500'>
                      {enrollments.length === 0
                        ? 'No students enrolled yet'
                        : 'No students found matching your filters'}
                    </td>
                  </tr>
                ) : (
                  filteredEnrollments.map((enrollment) => {
                    const user = enrollment.user as User;
                    const course = enrollment.course as Course;

                    return (
                      <tr key={enrollment._id} className='hover:bg-gray-50'>
                        <td className='px-6 py-4'>
                          <div className='flex items-center space-x-3'>
                            <div className='w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm'>
                              {getInitials(user?.name || 'Unknown')}
                            </div>
                            <div>
                              <p className='font-medium text-gray-900'>{user?.name || 'Unknown'}</p>
                              <p className='text-sm text-gray-500'>{user?.email || ''}</p>
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <p className='text-sm text-gray-900 line-clamp-2'>
                            {course?.title || 'Unknown Course'}
                          </p>
                        </td>
                        <td className='px-6 py-4'>
                          <div className='flex items-center space-x-2'>
                            <div className='w-24 bg-gray-200 rounded-full h-2'>
                              <div
                                className={`h-2 rounded-full ${
                                  enrollment.progress === 100
                                    ? 'bg-green-600'
                                    : enrollment.progress > 0
                                    ? 'bg-blue-600'
                                    : 'bg-gray-300'
                                }`}
                                style={{ width: `${enrollment.progress}%` }}
                              />
                            </div>
                            <span className='text-sm font-medium text-gray-900'>
                              {enrollment.progress}%
                            </span>
                          </div>
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-500'>
                          {formatDate(enrollment.enrolledAt)}
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-900'>
                          {enrollment.completedLessons?.length || 0}
                        </td>
                        <td className='px-6 py-4 text-right'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => router.push(`/admin/students/${enrollment._id}`)}
                          >
                            <Eye className='w-4 h-4' />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default AdminStudents;
