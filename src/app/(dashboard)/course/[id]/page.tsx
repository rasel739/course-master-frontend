'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Clock,
  Play,
  Users,
  Award,
  ChevronDown,
  ChevronRight,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { fetchCourseById } from '@/redux/features/courseSlice';
import { enrollInCourse } from '@/redux/features/enrollmentSlice';
import toast from 'react-hot-toast';
import { formatDate, formatDuration, formatPrice } from '@/utils';

const CourseDetails = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedCourse: course, isLoading } = useAppSelector((state) => state.course);
  const { user } = useAppSelector((state) => state.auth);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchCourseById(params.id as string));
    }
  }, [dispatch, params.id]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
  };

  const handleEnroll = async () => {
    if (!course) return;

    setEnrolling(true);
    try {
      await dispatch(enrollInCourse(course._id)).unwrap();
      router.push('/dashboard');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid enroll in courese';
      toast.error(errorMessage);
    } finally {
      setEnrolling(false);
    }
  };

  if (isLoading) {
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

  const isEnrolled = user?.enrolledCourses.includes(course._id);
  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const totalDuration = course.modules.reduce(
    (sum, m) => sum + m.lessons.reduce((s, l) => s + l.duration, 0),
    0
  );

  return (
    <div className='space-y-6'>
      {/* Course Header */}
      <div className='bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white'>
        <div className='max-w-4xl'>
          <div className='mb-4'>
            <span className='bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium'>
              {course.category}
            </span>
          </div>
          <h1 className='text-4xl font-bold mb-4'>{course.title}</h1>
          <p className='text-lg text-blue-100 mb-6'>{course.description}</p>

          <div className='flex flex-wrap gap-6 text-sm'>
            <div className='flex items-center'>
              <Award className='w-5 h-5 mr-2' />
              <span>By {course.instructor}</span>
            </div>
            <div className='flex items-center'>
              <Users className='w-5 h-5 mr-2' />
              <span>{course.totalEnrollments} students enrolled</span>
            </div>
            <div className='flex items-center'>
              <Play className='w-5 h-5 mr-2' />
              <span>{totalLessons} lessons</span>
            </div>
            <div className='flex items-center'>
              <Clock className='w-5 h-5 mr-2' />
              <span>{formatDuration(totalDuration)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 space-y-6'>
          <Card>
            <CardContent className='p-6'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>{" What You'll Learn"}</h2>
              <div className='space-y-3'>
                {course.tags.map((tag, index) => (
                  <div key={index} className='flex items-start'>
                    <CheckCircle className='w-5 h-5 text-green-600 mr-3 shrink-0 mt-0.5' />
                    <span className='text-gray-700'>{tag}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Course Content/Modules */}
          <Card>
            <CardContent className='p-6'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>Course Content</h2>
              <div className='space-y-2'>
                {course.modules
                  .sort((a, b) => a.order - b.order)
                  .map((module) => (
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
                            {module.description && (
                              <p className='text-sm text-gray-600 mt-1'>{module.description}</p>
                            )}
                          </div>
                        </div>
                        <span className='text-sm text-gray-500'>
                          {module.lessons.length} lessons
                        </span>
                      </button>

                      {expandedModules.includes(module._id) && (
                        <div className='border-t border-gray-200'>
                          {module.lessons
                            .sort((a, b) => a.order - b.order)
                            .map((lesson) => (
                              <div
                                key={lesson._id}
                                className='flex items-center justify-between p-4 hover:bg-gray-50'
                              >
                                <div className='flex items-center space-x-3'>
                                  <Play className='w-4 h-4 text-gray-400' />
                                  <span className='text-gray-700'>{lesson.title}</span>
                                </div>
                                <span className='text-sm text-gray-500'>{lesson.duration} min</span>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Enrollment Card */}
          <Card className='sticky top-6'>
            <CardContent className='p-6 space-y-4'>
              <div className='text-center'>
                <div className='text-4xl font-bold text-blue-600 mb-2'>
                  {formatPrice(course.price)}
                </div>
                <p className='text-sm text-gray-600'>One-time payment</p>
              </div>

              {isEnrolled ? (
                <Button className='w-full' onClick={() => router.push('/dashboard')}>
                  Go to Dashboard
                </Button>
              ) : (
                <Button className='w-full' onClick={handleEnroll} disabled={enrolling}>
                  {enrolling ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Enrolling...
                    </>
                  ) : (
                    'Enroll Now'
                  )}
                </Button>
              )}

              <div className='pt-4 border-t space-y-3 text-sm'>
                <div className='flex items-center justify-between'>
                  <span className='text-gray-600'>Batch</span>
                  <span className='font-medium'>Batch {course.batch.number}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-gray-600'>Start Date</span>
                  <span className='font-medium'>{formatDate(course.batch.startDate)}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-gray-600'>Duration</span>
                  <span className='font-medium'>{formatDuration(totalDuration)}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-gray-600'>Lessons</span>
                  <span className='font-medium'>{totalLessons}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <h3 className='font-semibold text-gray-900 mb-4'>Instructor</h3>
              <div className='flex items-center space-x-3'>
                <div className='w-12 h-12 bg-linear-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold'>
                  {course.instructor.charAt(0)}
                </div>
                <div>
                  <p className='font-medium text-gray-900'>{course.instructor}</p>
                  <p className='text-sm text-gray-600'>Expert Instructor</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
