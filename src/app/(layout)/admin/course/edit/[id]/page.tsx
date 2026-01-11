'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SubmitHandler, useForm, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { fetchCourseById } from '@/redux/features/courseSlice';
import { updateCourse } from '@/redux/features/adminSlice';
import { fetchCategories } from '@/redux/features/categorySlice';
import { Course, CourseCategory } from '@/types';
import { editCourseSchema } from '@/schema';

type EditCourseData = {
  title: string;
  description: string;
  instructor: string;
  category: CourseCategory;
  price: number;
  thumbnail?: string;
  tags?: string;
  isPublished: boolean;
};

const EditCourse = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedCourse: course, isLoading: courseLoading } = useAppSelector(
    (state) => state.course
  );
  const { isLoading } = useAppSelector((state) => state.admin);
  const { categories } = useAppSelector((state) => state.category);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditCourseData>({
    resolver: yupResolver(editCourseSchema) as Resolver<EditCourseData>,
  });

  useEffect(() => {
    dispatch(fetchCategories(false));
  }, [dispatch]);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchCourseById(params.id as string));
    }
  }, [dispatch, params.id]);

  useEffect(() => {
    if (course) {
      reset({
        title: course.title,
        description: course.description,
        instructor: course.instructor,
        category: course.category,
        price: course.price,
        thumbnail: course.thumbnail || '',
        tags: course.tags.join(', '),
        isPublished: course.isPublished,
      });
    }
  }, [course, reset]);

  const onSubmit: SubmitHandler<EditCourseData> = async (data) => {
    if (!course) return;

    const courseData: Partial<Course> = {
      title: data.title,
      description: data.description,
      instructor: data.instructor,
      category: data.category,
      price: data.price,
      thumbnail: data.thumbnail,
      tags: data.tags ? data.tags.split(',').map((t) => t.trim()) : [],
      isPublished: data.isPublished,
    };

    const result = await dispatch(updateCourse({ id: course._id, data: courseData }));
    if (updateCourse.fulfilled.match(result)) {
      router.push(`/admin/course/${course._id}`);
    }
  };

  if (courseLoading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <Loader2 className='w-8 h-8 animate-spin text-blue-600' />
      </div>
    );
  }

  if (!course) {
    return (
      <Card>
        <CardContent className='p-12 text-center'>
          <p className='text-gray-600'>Course not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center space-x-4'>
        <Button variant='ghost' size='sm' onClick={() => router.back()}>
          <ArrowLeft className='w-4 h-4 mr-2' />
          Back
        </Button>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Edit Course</h1>
          <p className='text-gray-600 mt-2'>Update course information</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* Title */}
            <div className='space-y-2'>
              <Label htmlFor='title'>
                Course Title <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='title'
                type='text'
                placeholder='e.g., Complete Web Development Bootcamp'
                {...register('title')}
              />
              {errors.title && <p className='text-sm text-red-600'>{errors.title.message}</p>}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>
                Description <span className='text-red-500'>*</span>
              </Label>
              <textarea
                id='description'
                rows={5}
                className='flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                placeholder='Describe what students will learn in this course...'
                {...register('description')}
              />
              {errors.description && (
                <p className='text-sm text-red-600'>{errors.description.message}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='instructor'>
                Instructor <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='instructor'
                type='text'
                placeholder='e.g., John Doe'
                {...register('instructor')}
              />
              {errors.instructor && (
                <p className='text-sm text-red-600'>{errors.instructor.message}</p>
              )}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <Label htmlFor='category'>
                  Category <span className='text-red-500'>*</span>
                </Label>
                <select
                  id='category'
                  className='flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2'
                  {...register('category')}
                >
                  <option value=''>Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className='text-sm text-red-600'>{errors.category.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='price'>
                  Price (USD) <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='price'
                  type='number'
                  step='0.01'
                  min='0'
                  placeholder='99.99'
                  {...register('price')}
                />
                {errors.price && <p className='text-sm text-red-600'>{errors.price.message}</p>}
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='thumbnail'>Thumbnail URL (Optional)</Label>
              <Input
                id='thumbnail'
                type='url'
                placeholder='https://example.com/image.jpg'
                {...register('thumbnail')}
              />
              {errors.thumbnail && (
                <p className='text-sm text-red-600'>{errors.thumbnail.message}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='tags'>Tags (Optional)</Label>
              <Input
                id='tags'
                type='text'
                placeholder='React, Node.js, MongoDB (comma-separated)'
                {...register('tags')}
              />
              <p className='text-xs text-gray-500'>Enter tags separated by commas</p>
            </div>

            <div className='space-y-2'>
              <div className='flex items-center space-x-2'>
                <input
                  id='isPublished'
                  type='checkbox'
                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
                  {...register('isPublished')}
                />
                <Label htmlFor='isPublished' className='cursor-pointer'>
                  Publish this course
                </Label>
              </div>
              <p className='text-xs text-gray-500'>Published courses will be visible to students</p>
            </div>

            <div className='flex items-center space-x-4 pt-4'>
              <Button type='submit' disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Updating...
                  </>
                ) : (
                  'Update Course'
                )}
              </Button>
              <Button type='button' variant='outline' onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCourse;
