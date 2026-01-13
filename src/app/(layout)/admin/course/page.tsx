'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { fetchCourses } from '@/redux/features/courseSlice';
import { deleteCourse } from '@/redux/features/adminSlice';
import { formatPrice, formatDate } from '@/utils';
import Loading from '@/app/loading';
import { COURSE_STATS, COURSE_TABLE_ITEMS } from '@/constants';

const AdminCourse = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { courses, isLoading, filters } = useAppSelector((state) => state.course);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCourses(filters));
  }, [dispatch, filters]);

  const handleDelete = async (id: string) => {
    if (deleteConfirm === id) {
      await dispatch(deleteCourse(id));
      setDeleteConfirm(null);
      dispatch(fetchCourses(filters));
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const filteredCourses = courses?.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Course Management</h1>
          <p className='text-gray-600 mt-2'>Create and manage all courses</p>
        </div>
        <Button className='cursor-pointer' onClick={() => router.push('/admin/course/create')}>
          <Plus className='w-4 h-4 mr-2' />
          Create Course
        </Button>
      </div>

      <div className='relative'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
        <Input
          type='text'
          placeholder='Search courses...'
          className='pl-10'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        {COURSE_STATS({
          coursesCount: courses?.length || 0,
          publishedCount: courses?.filter((c) => c.isPublished).length || 0,
          draftCount: courses?.filter((c) => !c.isPublished).length || 0,
          totalEnrollments: courses?.reduce((sum, c) => sum + c.totalEnrollments, 0) || 0,
        }).map((stat) => (
          <Card key={stat.label}>
            <CardContent className='p-4'>
              <p className='text-sm text-gray-600'>{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.valueColor}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className='p-0'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 border-b'>
                <tr>
                  {COURSE_TABLE_ITEMS.map((item) => (
                    <th key={item.title} className={item.style}>
                      {item.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredCourses?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className='px-6 py-12 text-center text-gray-500'>
                      No courses found
                    </td>
                  </tr>
                ) : (
                  filteredCourses?.map((course) => (
                    <tr key={course._id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4'>
                        <div>
                          <p className='font-medium text-gray-900 line-clamp-1'>{course?.title}</p>
                          <p className='text-sm text-gray-500'>by {course?.instructor}</p>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span className='px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800'>
                          {course?.category}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {formatPrice(course?.price)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {course?.totalEnrollments}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {course?.isPublished ? (
                          <span className='px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800'>
                            Published
                          </span>
                        ) : (
                          <span className='px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800'>
                            Draft
                          </span>
                        )}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {formatDate(course.createdAt)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                        <div className='flex items-center justify-end space-x-2'>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='cursor-pointer'
                            onClick={() => router.push(`/admin/course/${course._id}`)}
                          >
                            <Eye className='w-4 h-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='cursor-pointer'
                            onClick={() => router.push(`/admin/course/edit/${course._id}`)}
                          >
                            <Edit className='w-4 h-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleDelete(course._id)}
                            className={
                              deleteConfirm === course._id
                                ? 'text-red-600 hover:text-red-700 cursor-pointer'
                                : 'text-gray-600'
                            }
                          >
                            {deleteConfirm === course._id ? (
                              <span className='text-xs'>Confirm?</span>
                            ) : (
                              <Trash2 className='w-4 h-4' />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCourse;
