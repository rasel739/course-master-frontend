'use client';

import { CheckCircle, Play, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/utils';
import { Module } from '@/types';

interface CourseSidebarProps {
  modules: Module[];
  currentLesson?: { moduleId: string; lessonId: string };
  completedLessons?: { moduleId: string; lessonId: string }[];
  onLessonSelect?: (moduleId: string, lessonId: string) => void;
  progress?: number;
  className?: string;
}

export const CourseSidebar = ({
  modules,
  currentLesson,
  completedLessons = [],
  onLessonSelect,
  progress = 0,
  className,
}: CourseSidebarProps) => {
  const sortedModules = [...modules].sort((a, b) => a.order - b.order);

  const isLessonCompleted = (moduleId: string, lessonId: string) =>
    completedLessons.some((l) => l.moduleId === moduleId && l.lessonId === lessonId);

  const isCurrentLesson = (moduleId: string, lessonId: string) =>
    currentLesson?.moduleId === moduleId && currentLesson?.lessonId === lessonId;

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedCount = completedLessons.length;

  return (
    <div className={cn('bg-white h-full flex flex-col', className)}>
      {/* Header */}
      <div className='p-4 border-b'>
        <h2 className='font-bold text-gray-900 mb-2'>Course Content</h2>
        <Progress value={progress} showLabel size='sm' />
        <p className='text-xs text-gray-500 mt-2'>
          {completedCount} of {totalLessons} lessons completed
        </p>
      </div>

      {/* Modules List */}
      <div className='flex-1 overflow-y-auto'>
        {sortedModules.map((module, moduleIndex) => {
          const moduleCompleted = module.lessons.filter((l) =>
            isLessonCompleted(module._id, l._id)
          ).length;
          const isModuleComplete = moduleCompleted === module.lessons.length;
          const hasCurrentLesson = module.lessons.some((l) => isCurrentLesson(module._id, l._id));

          return (
            <div key={module._id} className='border-b'>
              {/* Module Header */}
              <div
                className={cn(
                  'px-4 py-3 bg-gray-50 flex items-start gap-3',
                  hasCurrentLesson && 'bg-blue-50'
                )}
              >
                <div className='shrink-0 mt-0.5'>
                  {isModuleComplete ? (
                    <CheckCircle className='w-5 h-5 text-green-600' />
                  ) : (
                    <div className='w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs text-gray-500'>
                      {moduleIndex + 1}
                    </div>
                  )}
                </div>
                <div className='flex-1 min-w-0'>
                  <h3 className='font-semibold text-sm text-gray-900 truncate'>{module.title}</h3>
                  <p className='text-xs text-gray-500'>
                    {moduleCompleted}/{module.lessons.length} completed
                  </p>
                </div>
              </div>

              {/* Lessons */}
              <div>
                {[...module.lessons]
                  .sort((a, b) => a.order - b.order)
                  .map((lesson, lessonIndex) => {
                    const completed = isLessonCompleted(module._id, lesson._id);
                    const isCurrent = isCurrentLesson(module._id, lesson._id);

                    return (
                      <button
                        key={lesson._id}
                        onClick={() => onLessonSelect?.(module._id, lesson._id)}
                        className={cn(
                          'w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50',
                          isCurrent && 'bg-blue-100 border-l-4 border-l-blue-600',
                          completed && !isCurrent && 'opacity-70'
                        )}
                      >
                        <div className='shrink-0 mt-0.5'>
                          {completed ? (
                            <CheckCircle className='w-4 h-4 text-green-600' />
                          ) : isCurrent ? (
                            <Play className='w-4 h-4 text-blue-600' fill='currentColor' />
                          ) : (
                            <Play className='w-4 h-4 text-gray-400' />
                          )}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p
                            className={cn(
                              'text-sm truncate',
                              isCurrent ? 'font-medium text-blue-600' : 'text-gray-700'
                            )}
                          >
                            {lessonIndex + 1}. {lesson.title}
                          </p>
                          <div className='flex items-center gap-1 text-xs text-gray-500 mt-0.5'>
                            <Clock className='w-3 h-3' />
                            <span>{lesson.duration}:00</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseSidebar;
