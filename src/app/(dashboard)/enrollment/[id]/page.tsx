'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  CheckCircle,
  Clock,
  Menu,
  X,
  ArrowLeft,
  SkipForward,
  FileText,
  MessageSquare,
  HelpCircle,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import VideoPlayer from '@/components/player/video-player';
import { CourseSidebar } from '@/components/player/course-sidebar';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { fetchEnrollmentDetails, markLessonComplete } from '@/redux/features/enrollmentSlice';
import { Course, Lesson, Module, Assignment, Quiz } from '@/types';
import Loading from '@/app/loading';
import { cn } from '@/utils';
import { studentApi } from '@/helpers/axios/api';
import { AssignmentModal } from '@/components/student/AssignmentModal';
import { QuizModal } from '@/components/student/QuizModal';
import { CourseCompletionBanner } from '@/components/student/CourseCompletionBanner';

const EnrollmentDetails = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedEnrollment: enrollment, isLoading } = useAppSelector((state) => state.enrollment);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentLesson, setCurrentLesson] = useState<{
    moduleId: string;
    lessonId: string;
    lesson: Lesson;
    module: Module;
  } | null>(null);

  // Assignments and quizzes state
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loadingExtras, setLoadingExtras] = useState(false);

  // Modal state
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [quizModalOpen, setQuizModalOpen] = useState(false);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchEnrollmentDetails(params.id as string));
    }
  }, [dispatch, params.id]);

  useEffect(() => {
    if (enrollment) {
      const course = enrollment.course as Course;
      const sortedModules = [...course.modules].sort((a, b) => a.order - b.order);

      // Fetch assignments and quizzes for this course
      fetchCourseExtras(course._id);

      // Find the first incomplete lesson or first lesson
      // eslint-disable-next-line @next/next/no-assign-module-variable
      for (const module of sortedModules) {
        const sortedLessons = [...module.lessons].sort((a, b) => a.order - b.order);
        for (const lesson of sortedLessons) {
          const isCompleted = enrollment.completedLessons.some(
            (cl) => cl.moduleId === module._id && cl.lessonId === lesson._id
          );
          if (!isCompleted) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCurrentLesson({ moduleId: module._id, lessonId: lesson._id, lesson, module });
            return;
          }
        }
      }

      // All completed, show first lesson
      if (sortedModules.length > 0 && sortedModules[0].lessons.length > 0) {
        // eslint-disable-next-line @next/next/no-assign-module-variable
        const module = sortedModules[0];
        const lesson = [...module.lessons].sort((a, b) => a.order - b.order)[0];
        setCurrentLesson({ moduleId: module._id, lessonId: lesson._id, lesson, module });
      }
    }
  }, [enrollment]);

  const fetchCourseExtras = async (courseId: string) => {
    setLoadingExtras(true);
    try {
      const [assignmentsRes, quizzesRes] = await Promise.all([
        studentApi.getAssignmentsByCourse(courseId),
        studentApi.getQuizzesByCourse(courseId),
      ]);
      setAssignments(assignmentsRes.data.data || []);
      setQuizzes(quizzesRes.data.data || []);
    } catch (error) {
      console.error('Error fetching course extras:', error);
    } finally {
      setLoadingExtras(false);
    }
  };

  const handleLessonSelect = (moduleId: string, lessonId: string) => {
    if (!enrollment) return;
    const course = enrollment.course as Course;
    // eslint-disable-next-line @next/next/no-assign-module-variable
    const module = course.modules.find((m) => m._id === moduleId);
    const lesson = module?.lessons.find((l) => l._id === lessonId);
    if (module && lesson) {
      setCurrentLesson({ moduleId, lessonId, lesson, module });
    }
  };

  const handleMarkComplete = async () => {
    if (!enrollment || !currentLesson) return;

    await dispatch(
      markLessonComplete({
        enrollmentId: enrollment._id,
        moduleId: currentLesson.moduleId,
        lessonId: currentLesson.lessonId,
      })
    );

    goToNextLesson();
  };

  const goToNextLesson = () => {
    if (!enrollment || !currentLesson) return;
    const course = enrollment.course as Course;
    const sortedModules = [...course.modules].sort((a, b) => a.order - b.order);

    let foundCurrent = false;
    // eslint-disable-next-line @next/next/no-assign-module-variable
    for (const module of sortedModules) {
      const sortedLessons = [...module.lessons].sort((a, b) => a.order - b.order);
      for (const lesson of sortedLessons) {
        if (foundCurrent) {
          setCurrentLesson({ moduleId: module._id, lessonId: lesson._id, lesson, module });
          return;
        }
        if (module._id === currentLesson.moduleId && lesson._id === currentLesson.lessonId) {
          foundCurrent = true;
        }
      }
    }
  };

  const isLessonCompleted = useMemo(() => {
    if (!enrollment || !currentLesson) return false;
    return enrollment.completedLessons.some(
      (cl) => cl.moduleId === currentLesson.moduleId && cl.lessonId === currentLesson.lessonId
    );
  }, [enrollment, currentLesson]);

  // Get assignments and quizzes for current module
  const currentModuleAssignments = useMemo(() => {
    if (!currentLesson) return [];
    return assignments.filter((a) => a.module === currentLesson.moduleId);
  }, [assignments, currentLesson]);

  const currentModuleQuizzes = useMemo(() => {
    if (!currentLesson) return [];
    return quizzes.filter((q) => q.module === currentLesson.moduleId);
  }, [quizzes, currentLesson]);

  if (isLoading) {
    return <Loading />;
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
    <div className='min-h-screen bg-gray-900 flex flex-col'>
      {/* Top Bar */}
      <div className='bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between shrink-0'>
        <div className='flex items-center space-x-4'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => router.push('/dashboard')}
            className='text-gray-300 hover:text-white hover:bg-gray-700'
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back
          </Button>
          <div className='hidden md:block'>
            <h1 className='text-white font-semibold truncate max-w-md'>{course.title}</h1>
          </div>
        </div>

        <div className='flex items-center space-x-4'>
          <div className='hidden md:flex items-center space-x-2'>
            <Progress value={enrollment.progress} size='sm' className='w-32' />
            <span className='text-sm text-gray-400'>{enrollment.progress}% complete</span>
          </div>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className='text-gray-300 hover:text-white hover:bg-gray-700'
          >
            {sidebarOpen ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex overflow-hidden'>
        {/* Video Area */}
        <div className={cn('flex-1 flex flex-col', sidebarOpen ? 'lg:mr-[400px]' : '')}>
          {/* Video Player */}
          <div className='w-full bg-black'>
            {currentLesson ? (
              <VideoPlayer
                src={currentLesson.lesson.videoUrl}
                autoPlay={true}
                title={currentLesson.lesson.title}
                onComplete={handleMarkComplete}
                className='aspect-video max-h-[calc(100vh-250px)]'
              />
            ) : (
              <div className='aspect-video flex items-center justify-center text-gray-500'>
                <p>Select a lesson to start learning</p>
              </div>
            )}
          </div>

          {/* Lesson Info */}
          <div className='flex-1 bg-white overflow-y-auto'>
            <div className='max-w-4xl mx-auto p-6'>
              {/* Course Completion Banner */}
              <CourseCompletionBanner
                enrollmentId={enrollment._id}
                courseId={course._id}
                courseName={course.title}
                progress={enrollment.progress}
              />

              {currentLesson && (
                <>
                  {/* Lesson Header */}
                  <div className='flex items-start justify-between mb-6'>
                    <div>
                      <Badge variant='secondary' className='mb-2'>
                        {currentLesson.module.title}
                      </Badge>
                      <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                        {currentLesson.lesson.title}
                      </h2>
                      <div className='flex items-center space-x-4 text-sm text-gray-500'>
                        <span className='flex items-center'>
                          <Clock className='w-4 h-4 mr-1' />
                          {currentLesson.lesson.duration} minutes
                        </span>
                      </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                      {!isLessonCompleted ? (
                        <Button onClick={handleMarkComplete}>
                          <CheckCircle className='w-4 h-4 mr-2' />
                          Mark as Complete
                        </Button>
                      ) : (
                        <Badge variant='success' className='py-2 px-4'>
                          <CheckCircle className='w-4 h-4 mr-2' />
                          Completed
                        </Badge>
                      )}
                      <Button variant='outline' onClick={goToNextLesson}>
                        Next Lesson
                        <SkipForward className='w-4 h-4 ml-2' />
                      </Button>
                    </div>
                  </div>

                  {/* Tabs */}
                  <Tabs defaultValue='overview'>
                    <TabsList>
                      <TabsTrigger value='overview'>
                        <FileText className='w-4 h-4 mr-2' />
                        Overview
                      </TabsTrigger>
                      <TabsTrigger value='assignments'>
                        <Send className='w-4 h-4 mr-2' />
                        Assignments ({currentModuleAssignments.length})
                      </TabsTrigger>
                      <TabsTrigger value='quizzes'>
                        <HelpCircle className='w-4 h-4 mr-2' />
                        Quizzes ({currentModuleQuizzes.length})
                      </TabsTrigger>
                      <TabsTrigger value='notes'>
                        <MessageSquare className='w-4 h-4 mr-2' />
                        Notes
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value='overview'>
                      <Card>
                        <CardContent className='p-6'>
                          <h3 className='font-semibold text-gray-900 mb-4'>About this lesson</h3>
                          <p className='text-gray-600'>
                            In this lesson, you will learn the core concepts and practical
                            applications. Follow along with the video and practice the techniques
                            demonstrated.
                          </p>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value='assignments'>
                      <Card>
                        <CardContent className='p-6'>
                          <h3 className='font-semibold text-gray-900 mb-4'>Module Assignments</h3>
                          {loadingExtras ? (
                            <p className='text-gray-500'>Loading assignments...</p>
                          ) : currentModuleAssignments.length === 0 ? (
                            <p className='text-gray-500'>No assignments for this module.</p>
                          ) : (
                            <div className='space-y-4'>
                              {currentModuleAssignments.map((assignment: Assignment & { hasSubmitted?: boolean }) => (
                                <div
                                  key={assignment._id}
                                  className='flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50'
                                >
                                  <div className='flex items-center space-x-3'>
                                    <FileText className='w-5 h-5 text-blue-500' />
                                    <div>
                                      <h4 className='font-medium text-gray-900'>{assignment.title}</h4>
                                      <p className='text-sm text-gray-500 line-clamp-1'>
                                        {assignment.description}
                                      </p>
                                    </div>
                                  </div>
                                  <div className='flex items-center space-x-2'>
                                    {assignment.hasSubmitted ? (
                                      <Badge variant='success'>Submitted</Badge>
                                    ) : (
                                      <Badge variant='secondary'>Pending</Badge>
                                    )}
                                    <Button
                                      size='sm'
                                      variant='outline'
                                      onClick={() => {
                                        setSelectedAssignment(assignment);
                                        setAssignmentModalOpen(true);
                                      }}
                                    >
                                      {assignment.hasSubmitted ? 'View' : 'Submit'}
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value='quizzes'>
                      <Card>
                        <CardContent className='p-6'>
                          <h3 className='font-semibold text-gray-900 mb-4'>Module Quizzes</h3>
                          {loadingExtras ? (
                            <p className='text-gray-500'>Loading quizzes...</p>
                          ) : currentModuleQuizzes.length === 0 ? (
                            <p className='text-gray-500'>No quizzes for this module.</p>
                          ) : (
                            <div className='space-y-4'>
                              {currentModuleQuizzes.map((quiz: Quiz & { hasAttempted?: boolean; bestScore?: number; questionCount?: number }) => (
                                <div
                                  key={quiz._id}
                                  className='flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50'
                                >
                                  <div className='flex items-center space-x-3'>
                                    <HelpCircle className='w-5 h-5 text-purple-500' />
                                    <div>
                                      <h4 className='font-medium text-gray-900'>{quiz.title}</h4>
                                      <p className='text-sm text-gray-500'>
                                        {quiz.questionCount || quiz.questions?.length || 0} questions
                                      </p>
                                    </div>
                                  </div>
                                  <div className='flex items-center space-x-2'>
                                    {quiz.hasAttempted ? (
                                      <Badge variant='success'>Best: {quiz.bestScore}%</Badge>
                                    ) : (
                                      <Badge variant='secondary'>Not attempted</Badge>
                                    )}
                                    <Button
                                      size='sm'
                                      variant='outline'
                                      onClick={() => {
                                        setSelectedQuiz(quiz);
                                        setQuizModalOpen(true);
                                      }}
                                    >
                                      {quiz.hasAttempted ? 'Retry' : 'Start Quiz'}
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value='notes'>
                      <Card>
                        <CardContent className='p-6'>
                          <h3 className='font-semibold text-gray-900 mb-4'>Your Notes</h3>
                          <textarea
                            placeholder='Take notes while watching...'
                            className='w-full h-48 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500'
                          />
                          <Button className='mt-4'>Save Notes</Button>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div
          className={cn(
            'fixed top-[61px] right-0 w-[400px] h-[calc(100vh-61px)] bg-white border-l border-gray-200 transition-transform duration-300 z-40',
            sidebarOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <CourseSidebar
            modules={course.modules}
            currentLesson={
              currentLesson
                ? { moduleId: currentLesson.moduleId, lessonId: currentLesson.lessonId }
                : undefined
            }
            completedLessons={enrollment.completedLessons}
            onLessonSelect={handleLessonSelect}
            progress={enrollment.progress}
            className='h-full'
          />
        </div>
      </div>

      {/* Assignment Modal */}
      {selectedAssignment && (
        <AssignmentModal
          assignment={selectedAssignment as Assignment & { hasSubmitted?: boolean; userSubmission?: { content: string; submissionType: string } | null }}
          isOpen={assignmentModalOpen}
          onClose={() => {
            setAssignmentModalOpen(false);
            setSelectedAssignment(null);
          }}
          onSubmitSuccess={() => {
            const course = enrollment?.course as Course;
            if (course) {
              fetchCourseExtras(course._id);
            }
          }}
        />
      )}

      {/* Quiz Modal */}
      {selectedQuiz && (
        <QuizModal
          quiz={selectedQuiz as Quiz & { questionCount?: number }}
          isOpen={quizModalOpen}
          onClose={() => {
            setQuizModalOpen(false);
            setSelectedQuiz(null);
          }}
          onSubmitSuccess={() => {
            const course = enrollment?.course as Course;
            if (course) {
              fetchCourseExtras(course._id);
            }
          }}
        />
      )}
    </div>
  );
};

export default EnrollmentDetails;
