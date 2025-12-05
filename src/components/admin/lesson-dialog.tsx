'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Loader2 } from 'lucide-react';
import { CreateLessonRequest } from '@/types';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { addLesson, updateLesson } from '@/redux/features/adminSlice';
import { lessonSchema } from '@/schema';

interface LessonDialogProps {
  courseId: string;
  moduleId: string;
  lesson?: any;
  open: boolean;
  onClose: () => void;
}

const LessonDialog = ({ courseId, moduleId, lesson, open, onClose }: LessonDialogProps) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.admin);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateLessonRequest>({
    resolver: yupResolver(lessonSchema),
    defaultValues: lesson
      ? {
          title: lesson.title,
          videoUrl: lesson.videoUrl,
          duration: lesson.duration,
          order: lesson.order,
        }
      : undefined,
  });

  const onSubmit = async (data: CreateLessonRequest) => {
    if (lesson) {
      await dispatch(
        updateLesson({
          courseId,
          moduleId,
          lessonId: lesson._id,
          data,
        })
      );
    } else {
      await dispatch(addLesson({ courseId, moduleId, data }));
    }
    onClose();
  };

  if (!open) return null;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center justify-between p-6 border-b'>
          <h2 className='text-xl font-bold'>{lesson ? 'Edit Lesson' : 'Add Lesson'}</h2>
          <button onClick={onClose} className='p-2 hover:bg-gray-100 rounded-lg'>
            <X className='w-5 h-5' />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='p-6 space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='title'>
              Lesson Title <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='title'
              type='text'
              placeholder='e.g., Introduction to Components'
              {...register('title')}
            />
            {errors.title && <p className='text-sm text-red-600'>{errors.title.message}</p>}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='videoUrl'>
              Video URL <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='videoUrl'
              type='url'
              placeholder='https://youtube.com/watch?v=...'
              {...register('videoUrl')}
            />
            {errors.videoUrl && <p className='text-sm text-red-600'>{errors.videoUrl.message}</p>}
            <p className='text-xs text-gray-500'>YouTube, Vimeo, or direct video URL</p>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='duration'>
              Duration (minutes) <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='duration'
              type='number'
              min='1'
              max='600'
              placeholder='15'
              {...register('duration')}
            />
            {errors.duration && <p className='text-sm text-red-600'>{errors.duration.message}</p>}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='order'>Order (Optional)</Label>
            <Input id='order' type='number' min='1' placeholder='1' {...register('order')} />
            {errors.order && <p className='text-sm text-red-600'>{errors.order.message}</p>}
            <p className='text-xs text-gray-500'>Leave empty to add at the end</p>
          </div>

          <div className='flex items-center space-x-3 pt-4'>
            <Button type='submit' disabled={isLoading} className='flex-1'>
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Saving...
                </>
              ) : lesson ? (
                'Update Lesson'
              ) : (
                'Add Lesson'
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

export default LessonDialog;
