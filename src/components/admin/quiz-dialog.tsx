'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus, Trash2, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { createQuiz } from '@/redux/features/adminSlice';
import { courseApi } from '@/helpers/axios/api';
import { Course, Question } from '@/types';

type QuizFormData = {
  course: string;
  module: string;
  title: string;
  questions: {
    question: string;
    options: [string, string, string, string];
    correctAnswer: number;
  }[];
};

interface QuizDialogProps {
  open: boolean;
  onClose: () => void;
}

const QuizDialog = ({ open, onClose }: QuizDialogProps) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.admin);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<QuizFormData>({
    defaultValues: {
      questions: [
        {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
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

  const onSubmit = async (data: QuizFormData) => {
    const quizData = {
      ...data,
      questions: data.questions.map((q) => ({
        question: q.question,
        options: q.options,
        correctAnswer: Number(q.correctAnswer),
      })),
    };

    await dispatch(createQuiz(quizData));
    onClose();
  };

  if (!open) return null;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10'>
          <h2 className='text-xl font-bold'>Create Quiz</h2>
          <button onClick={onClose} className='p-2 hover:bg-gray-100 rounded-lg'>
            <X className='w-5 h-5' />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='p-6 space-y-6'>
          {/* Course & Module Selection */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='course'>
                Course <span className='text-red-500'>*</span>
              </Label>
              <select
                id='course'
                className='flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm'
                {...register('course', { required: true })}
              >
                <option value=''>Select a course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='module'>
                Module <span className='text-red-500'>*</span>
              </Label>
              <select
                id='module'
                className='flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm'
                {...register('module', { required: true })}
                disabled={!selectedCourse}
              >
                <option value=''>Select a module</option>
                {selectedCourse?.modules.map((module) => (
                  <option key={module._id} value={module._id}>
                    {module.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quiz Title */}
          <div className='space-y-2'>
            <Label htmlFor='title'>
              Quiz Title <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='title'
              type='text'
              placeholder='e.g., React Hooks Quiz'
              {...register('title', { required: true })}
            />
          </div>

          {/* Questions */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <Label className='text-lg font-semibold'>Questions</Label>
              <Button
                type='button'
                size='sm'
                variant='outline'
                onClick={() =>
                  append({
                    question: '',
                    options: ['', '', '', ''],
                    correctAnswer: 0,
                  })
                }
              >
                <Plus className='w-4 h-4 mr-2' />
                Add Question
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className='border border-gray-200 rounded-lg p-4 space-y-4'>
                <div className='flex items-center justify-between'>
                  <h4 className='font-semibold text-gray-900'>Question {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button type='button' size='sm' variant='ghost' onClick={() => remove(index)}>
                      <Trash2 className='w-4 h-4 text-red-600' />
                    </Button>
                  )}
                </div>

                {/* Question Text */}
                <div className='space-y-2'>
                  <Label>Question Text *</Label>
                  <Input
                    placeholder='Enter your question'
                    {...register(`questions.${index}.question`, {
                      required: true,
                    })}
                  />
                </div>

                {/* Options */}
                <div className='space-y-2'>
                  <Label>Options *</Label>
                  {([0, 1, 2, 3] as const).map((optionIndex) => (
                    <div key={optionIndex} className='flex items-center space-x-2'>
                      <span className='text-sm font-medium text-gray-600 w-8'>
                        {String.fromCharCode(65 + optionIndex)}.
                      </span>
                      <Input
                        placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                        {...register(`questions.${index}.options.${optionIndex}`)}
                      />
                    </div>
                  ))}
                </div>

                {/* Correct Answer */}
                <div className='space-y-2'>
                  <Label>Correct Answer *</Label>
                  <select
                    className='flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm'
                    {...register(`questions.${index}.correctAnswer`, {
                      required: true,
                      valueAsNumber: true,
                    })}
                  >
                    <option value={0}>A</option>
                    <option value={1}>B</option>
                    <option value={2}>C</option>
                    <option value={3}>D</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Buttons */}
          <div className='flex items-center space-x-3 pt-4 sticky bottom-0 bg-white border-t -mx-6 px-6 py-4'>
            <Button type='submit' disabled={isLoading} className='flex-1'>
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Creating Quiz...
                </>
              ) : (
                'Create Quiz'
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

export default QuizDialog;
