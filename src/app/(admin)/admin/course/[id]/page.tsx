'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Loader2,
  Play,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { fetchCourseById } from '@/redux/features/courseSlice';
import { setSelectedCourse, deleteModule, deleteLesson } from '@/redux/features/adminSlice';
import { formatPrice } from '@/utils';
import ModuleDialog from '@/components/admin/module-dialog';
import LessonDialog from '@/components/admin/lesson-dialog';
import { Module, Lesson } from '@/types';

const AdminCourseDetails = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedCourse: course, isLoading } = useAppSelector((state) => state.course);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchCourseById(params.id as string));
    }
  }, [dispatch, params.id]);

  useEffect(() => {
    if (course) {
      dispatch(setSelectedCourse(course));
    }
  }, [course, dispatch]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (confirm('Are you sure you want to delete this module?')) {
      await dispatch(deleteModule({ courseId: course!._id, moduleId }));
      dispatch(fetchCourseById(course!._id));
    }
  };

  const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      await dispatch(deleteLesson({ courseId: course!._id, moduleId, lessonId }));
      dispatch(fetchCourseById(course!._id));
    }
  };

  const openAddModuleDialog = () => {
    setEditingModule(null);
    setModuleDialogOpen(true);
  };

  const openEditModuleDialog = (module: Module) => {
    setEditingModule(module);
    setModuleDialogOpen(true);
  };

  const openAddLessonDialog = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setEditingLesson(null);
    setLessonDialogOpen(true);
  };

  const openEditLessonDialog = (moduleId: string, lesson: Lesson) => {
    setSelectedModuleId(moduleId);
    setEditingLesson(lesson);
    setLessonDialogOpen(true);
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

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Button variant='ghost' size='sm' onClick={() => router.back()}>
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back
          </Button>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>{course.title}</h1>
            <p className='text-gray-600 mt-2'>Manage course content</p>
          </div>
        </div>
        <Button variant='outline' onClick={() => router.push(`/admin/course/edit/${course._id}`)}>
          <Edit className='w-4 h-4 mr-2' />
          Edit Course
        </Button>
      </div>

      {/* Course Info */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-600'>Category</p>
            <p className='text-lg font-semibold text-gray-900'>{course.category}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-600'>Price</p>
            <p className='text-lg font-semibold text-gray-900'>{formatPrice(course.price)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-600'>Enrollments</p>
            <p className='text-lg font-semibold text-gray-900'>{course.totalEnrollments}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-600'>Status</p>
            {course.isPublished ? (
              <span className='px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800'>
                Published
              </span>
            ) : (
              <span className='px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800'>
                Draft
              </span>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modules */}
      <Card>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl font-bold text-gray-900'>Course Modules</h2>
            <Button size='sm' onClick={openAddModuleDialog}>
              <Plus className='w-4 h-4 mr-2' />
              Add Module
            </Button>
          </div>

          {course.modules.length === 0 ? (
            <div className='text-center py-12 text-gray-500'>
              <p>No modules yet. Add your first module to get started.</p>
            </div>
          ) : (
            <div className='space-y-2'>
              {course.modules
                .sort((a, b) => a.order - b.order)
                .map((module) => (
                  <div key={module._id} className='border border-gray-200 rounded-lg'>
                    <div className='flex items-center justify-between p-4 hover:bg-gray-50'>
                      <button
                        onClick={() => toggleModule(module._id)}
                        className='flex items-center space-x-3 flex-1'
                      >
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
                          <p className='text-xs text-gray-500 mt-1'>
                            {module.lessons.length} lessons • Order: {module.order}
                          </p>
                        </div>
                      </button>
                      <div className='flex items-center space-x-2'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => openAddLessonDialog(module._id)}
                        >
                          <Plus className='w-4 h-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => openEditModuleDialog(module)}
                        >
                          <Edit className='w-4 h-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleDeleteModule(module._id)}
                        >
                          <Trash2 className='w-4 h-4 text-red-600' />
                        </Button>
                      </div>
                    </div>

                    {expandedModules.includes(module._id) && (
                      <div className='border-t border-gray-200 bg-gray-50'>
                        {module.lessons.length === 0 ? (
                          <div className='p-4 text-center text-gray-500 text-sm'>
                            No lessons yet. Add your first lesson.
                          </div>
                        ) : (
                          module.lessons
                            .sort((a, b) => a.order - b.order)
                            .map((lesson) => (
                              <div
                                key={lesson._id}
                                className='flex items-center justify-between p-4 hover:bg-gray-100'
                              >
                                <div className='flex items-center space-x-3'>
                                  <Play className='w-4 h-4 text-gray-400' />
                                  <div>
                                    <p className='font-medium text-gray-900'>{lesson.title}</p>
                                    <p className='text-xs text-gray-500'>
                                      {lesson.duration} min • Order: {lesson.order}
                                    </p>
                                  </div>
                                </div>
                                <div className='flex items-center space-x-2'>
                                  <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() => openEditLessonDialog(module._id, lesson)}
                                  >
                                    <Edit className='w-4 h-4' />
                                  </Button>
                                  <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() => handleDeleteLesson(module._id, lesson._id)}
                                  >
                                    <Trash2 className='w-4 h-4 text-red-600' />
                                  </Button>
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      {moduleDialogOpen && (
        <ModuleDialog
          courseId={course._id}
          module={editingModule || undefined}
          open={moduleDialogOpen}
          onClose={() => {
            setModuleDialogOpen(false);
            setEditingModule(null);
            dispatch(fetchCourseById(course._id));
          }}
        />
      )}

      {lessonDialogOpen && selectedModuleId && (
        <LessonDialog
          courseId={course._id}
          moduleId={selectedModuleId}
          lesson={editingLesson || undefined}
          open={lessonDialogOpen}
          onClose={() => {
            setLessonDialogOpen(false);
            setEditingLesson(null);
            setSelectedModuleId(null);
            dispatch(fetchCourseById(course._id));
          }}
        />
      )}
    </div>
  );
};

export default AdminCourseDetails;
