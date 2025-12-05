'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Play, CheckCircle, Clock, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { fetchEnrollmentDetails, markLessonComplete } from '@/redux/features/enrollmentSlice';
import { Course } from '@/types';

const EnrollmentDetails = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const { selectedEnrollment: enrollment, isLoading } = useAppSelector((state) => state.enrollment);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<{
    moduleId: string;
    lessonId: string;
  } | null>(null);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchEnrollmentDetails(params.id as string));
    }
  }, [dispatch, params.id]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
  };

  const isLessonCompleted = (moduleId: string, lessonId: string) => {
    return enrollment?.completedLessons.some(
      (cl) => cl.moduleId === moduleId && cl.lessonId === lessonId
    );
  };

  const handleMarkComplete = async (moduleId: string, lessonId: string) => {
    if (!enrollment) return;

    await dispatch(
      markLessonComplete({
        enrollmentId: enrollment._id,
        moduleId,
        lessonId,
      })
    );
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <Loader2 className='w-8 h-8 animate-spin text-blue-600' />
      </div>
    );
  }

  if (!enrollment) {
    return (
      <Card>
        <CardContent className='p-12 text-center'>
          <p className='text-gray-600'>Enrollment not found</p>
        </CardContent>
      </Card>
    );
  }

  const course = enrollment.course as Course;

  return (
    <div className='space-y-6'>
      {/* Course Header */}
      <Card>
        <CardContent className='p-6'>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div>
              <h1 className='text-2xl font-bold text-gray-900 mb-2'>{course.title}</h1>
              <p className='text-gray-600'>by {course.instructor}</p>
            </div>
            <div className='text-right'>
              <div className='text-3xl font-bold text-blue-600 mb-1'>{enrollment.progress}%</div>
              <p className='text-sm text-gray-600'>Complete</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className='mt-6'>
            <div className='w-full bg-gray-200 rounded-full h-3'>
              <div
                className='bg-blue-600 h-3 rounded-full transition-all'
                style={{ width: `${enrollment?.progress}%` }}
              />
            </div>
            <div className='flex justify-between mt-2 text-sm text-gray-600'>
              <span>{enrollment?.completedLessons.length} lessons completed</span>
              <span>
                {course?.modules.reduce((sum, m) => sum + m.lessons.length, 0)} total lessons
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Modules List */}
        <div className='lg:col-span-2'>
          <Card>
            <CardContent className='p-6'>
              <h2 className='text-xl font-bold text-gray-900 mb-4'>Course Content</h2>
              <div className='space-y-2'>
                {course?.modules
                  ?.map((module) => ({ ...module }))
                  .sort((a, b) => a.order - b.order)
                  .map((module) => {
                    const completedLessons = module.lessons.filter((lesson) =>
                      isLessonCompleted(module._id, lesson._id)
                    ).length;
                    const totalLessons = module.lessons.length;
                    const moduleProgress = Math.round((completedLessons / totalLessons) * 100);

                    return (
                      <div key={module._id} className='border border-gray-200 rounded-lg'>
                        <button
                          onClick={() => toggleModule(module._id)}
                          className='w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors'
                        >
                          <div className='flex items-center space-x-3'>
                            {expandedModules.includes(module._id) ? (
                              <ChevronDown className='w-5 h-5 text-gray-600' />
                            ) : (
                              <ChevronRight className='w-5 h-5 text-gray-600' />
                            )}
                            <div className='text-left'>
                              <h3 className='font-semibold text-gray-900'>{module.title}</h3>
                              <div className='flex items-center space-x-2 mt-1'>
                                <div className='w-24 bg-gray-200 rounded-full h-1.5'>
                                  <div
                                    className='bg-blue-600 h-1.5 rounded-full'
                                    style={{ width: `${moduleProgress}%` }}
                                  />
                                </div>
                                <span className='text-xs text-gray-500'>
                                  {completedLessons}/{totalLessons}
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>

                        {expandedModules.includes(module._id) && (
                          <div className='border-t border-gray-200'>
                            {module?.lessons
                              ?.map((lesson) => ({ ...lesson }))
                              .sort((a, b) => a.order - b.order)
                              .map((lesson) => {
                                const completed = isLessonCompleted(module._id, lesson._id);

                                return (
                                  <div
                                    key={lesson._id}
                                    className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                                      selectedLesson?.lessonId === lesson._id ? 'bg-blue-50' : ''
                                    }`}
                                  >
                                    <div className='flex items-center space-x-3 flex-1'>
                                      {completed ? (
                                        <CheckCircle className='w-5 h-5 text-green-600' />
                                      ) : (
                                        <Play className='w-5 h-5 text-gray-400' />
                                      )}
                                      <div className='flex-1'>
                                        <p
                                          className={`font-medium ${
                                            completed ? 'text-green-600' : 'text-gray-700'
                                          }`}
                                        >
                                          {lesson.title}
                                        </p>
                                        <div className='flex items-center space-x-2 mt-1 text-xs text-gray-500'>
                                          <Clock className='w-3 h-3' />
                                          <span>{lesson.duration} min</span>
                                        </div>
                                      </div>
                                    </div>

                                    {!completed && (
                                      <Button
                                        size='sm'
                                        variant='outline'
                                        onClick={() => handleMarkComplete(module._id, lesson._id)}
                                      >
                                        Mark Complete
                                      </Button>
                                    )}
                                  </div>
                                );
                              })}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Stats Card */}
          <Card>
            <CardContent className='p-6 space-y-4'>
              <h3 className='font-semibold text-gray-900'>Your Progress</h3>

              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>Progress</span>
                  <span className='font-semibold text-blue-600'>{enrollment.progress}%</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>Completed Lessons</span>
                  <span className='font-semibold'>{enrollment.completedLessons.length}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>Total Lessons</span>
                  <span className='font-semibold'>
                    {course.modules.reduce((sum, m) => sum + m.lessons.length, 0)}
                  </span>
                </div>
              </div>

              {enrollment.progress === 100 && (
                <div className='pt-4 border-t'>
                  <div className='bg-green-50 border border-green-200 rounded-lg p-4 text-center'>
                    <CheckCircle className='w-8 h-8 text-green-600 mx-auto mb-2' />
                    <p className='text-sm font-medium text-green-800'>Course Completed!</p>
                    <p className='text-xs text-green-600 mt-1'>
                      {"  You've completed all lessons"}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Course Info */}
          <Card>
            <CardContent className='p-6 space-y-4'>
              <h3 className='font-semibold text-gray-900'>Course Info</h3>
              <div className='space-y-3 text-sm'>
                <div>
                  <p className='text-gray-600 mb-1'>Category</p>
                  <p className='font-medium'>{course.category}</p>
                </div>
                <div>
                  <p className='text-gray-600 mb-1'>Instructor</p>
                  <p className='font-medium'>{course.instructor}</p>
                </div>
                <div>
                  <p className='text-gray-600 mb-1'>Total Modules</p>
                  <p className='font-medium'>{course.modules.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentDetails;
