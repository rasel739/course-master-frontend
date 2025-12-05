'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { createAssignment } from '@/redux/features/adminSlice';
import { courseApi } from '@/helpers/axios/api';
import { Course } from '@/types';

const schema = yup.object({
  course: yup.string().required('Course is required'),
  module: yup.string().required('Module is required'),
  title: yup
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title cannot exceed 200 characters')
    .required('Title is required'),
  description: yup
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description cannot exceed 2000 characters')
    .required('Description is required'),
});

type AssignmentFormData = {
  course: string;
  module: string;
  title: string;
  description: string;
};

interface AssignmentDialogProps {
  open: boolean;
  onClose: () => void;
}

const AssignmentDialog = ({ open, onClose }: AssignmentDialogProps) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.admin);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<AssignmentFormData>({
    resolver: yupResolver(schema),
  });

  const courseId = watch('course');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseApi.getCourses({ limit: 100 });
        setCourses(response.data.data?.courses || []);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const course = courses.find((c) => c._id === courseId);
    setSelectedCourse(course || null);
    if (!course) {
      setValue('module', '');
    }
  }, [courseId, courses, setValue]);

  const onSubmit = async (data: AssignmentFormData) => {
    await dispatch(createAssignment(data));
    onClose();
  };

  if (!open) return null;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center justify-between p-6 border-b'>
          <h2 className='text-xl font-bold'>Create Assignment</h2>
          <button onClick={onClose} className='p-2 hover:bg-gray-100 rounded-lg'>
            <X className='w-5 h-5' />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='p-6 space-y-4'>
          {/* Course Selection */}
          <div className='space-y-2'>
            <Label htmlFor='course'>
              Course <span className='text-red-500'>*</span>
            </Label>
            <select
              id='course'
              className='flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm'
              {...register('course')}
            >
              <option value=''>Select a course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
            {errors.course && <p className='text-sm text-red-600'>{errors.course.message}</p>}
          </div>

          {/* Module Selection */}
          <div className='space-y-2'>
            <Label htmlFor='module'>
              Module <span className='text-red-500'>*</span>
            </Label>
            <select
              id='module'
              className='flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm'
              {...register('module')}
              disabled={!selectedCourse}
            >
              <option value=''>Select a module</option>
              {selectedCourse?.modules.map((module) => (
                <option key={module._id} value={module._id}>
                  {module.title}
                </option>
              ))}
            </select>
            {errors.module && <p className='text-sm text-red-600'>{errors.module.message}</p>}
          </div>

          {/* Title */}
          <div className='space-y-2'>
            <Label htmlFor='title'>
              Assignment Title <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='title'
              type='text'
              placeholder='e.g., Build a Todo App'
              {...register('title')}
            />
            {errors.title && <p className='text-sm text-red-600'>{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div className='space-y-2'>
            <Label htmlFor='description'>
              Description <span className='text-red-500'>*</span>
            </Label>
            <textarea
              id='description'
              rows={6}
              className='flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600'
              placeholder='Describe the assignment requirements...'
              {...register('description')}
            />
            {errors.description && (
              <p className='text-sm text-red-600'>{errors.description.message}</p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className='flex items-center space-x-3 pt-4'>
            <Button type='submit' disabled={isLoading} className='flex-1'>
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Creating...
                </>
              ) : (
                'Create Assignment'
              )}
            </Button>
            <Button type='button' variant='outline' onClick={onClose} className='flex-1'>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AssignmentDialog;
