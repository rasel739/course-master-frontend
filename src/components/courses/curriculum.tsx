'use client';

import { Play, Lock, CheckCircle } from 'lucide-react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils';
import { Module } from '@/types';

interface CurriculumProps {
  modules: Module[];
  completedLessons?: { moduleId: string; lessonId: string }[];
  currentLesson?: { moduleId: string; lessonId: string };
  onLessonClick?: (moduleId: string, lessonId: string) => void;
  isEnrolled?: boolean;
  defaultOpen?: string[];
  className?: string;
}

export const Curriculum = ({
  modules,
  completedLessons = [],
  currentLesson,
  onLessonClick,
  isEnrolled = false,
  defaultOpen = [],
  className,
}: CurriculumProps) => {
  const sortedModules = [...modules].sort((a, b) => a.order - b.order);
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const totalDuration = modules.reduce(
    (sum, m) => sum + m.lessons.reduce((s, l) => s + l.duration, 0),
    0
  );

  const isLessonCompleted = (moduleId: string, lessonId: string) =>
    completedLessons.some((l) => l.moduleId === moduleId && l.lessonId === lessonId);

  const isCurrentLesson = (moduleId: string, lessonId: string) =>
    currentLesson?.moduleId === moduleId && currentLesson?.lessonId === lessonId;

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className={cn('', className)}>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-bold text-gray-900'>Course Content</h2>
        <div className='text-sm text-gray-500'>
          {modules.length} sections • {totalLessons} lectures • {formatDuration(totalDuration)}
        </div>
      </div>

      <Accordion
        type='multiple'
        defaultValue={defaultOpen}
        className='border rounded-lg overflow-hidden'
      >
        {sortedModules.map((module, moduleIndex) => {
          const moduleProgress = module.lessons.filter((l) =>
            isLessonCompleted(module._id, l._id)
          ).length;
          const moduleDuration = module.lessons.reduce((s, l) => s + l.duration, 0);

          return (
            <AccordionItem key={module._id} value={module._id} className='border-b last:border-b-0'>
              <AccordionTrigger
                value={module._id}
                className='px-4 py-3 bg-gray-50 hover:bg-gray-100 font-normal'
              >
                <div className='flex items-center justify-between w-full pr-4'>
                  <div className='flex items-center space-x-3'>
                    <span className='font-semibold text-gray-900'>
                      Section {moduleIndex + 1}: {module.title}
                    </span>
                    {moduleProgress === module.lessons.length && module.lessons.length > 0 && (
                      <Badge variant='success' className='text-xs'>
                        Completed
                      </Badge>
                    )}
                  </div>
                  <span className='text-sm text-gray-500'>
                    {moduleProgress}/{module.lessons.length} • {formatDuration(moduleDuration)}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent value={module._id} className='px-0 py-0'>
                <div className='divide-y divide-gray-100'>
                  {[...module.lessons]
                    .sort((a, b) => a.order - b.order)
                    .map((lesson, lessonIndex) => {
                      const completed = isLessonCompleted(module._id, lesson._id);
                      const isCurrent = isCurrentLesson(module._id, lesson._id);

                      return (
                        <button
                          key={lesson._id}
                          onClick={() => isEnrolled && onLessonClick?.(module._id, lesson._id)}
                          disabled={!isEnrolled}
                          className={cn(
                            'w-full flex items-center justify-between px-4 py-3 text-left transition-colors',
                            isEnrolled ? 'hover:bg-blue-50 cursor-pointer' : 'cursor-default',
                            isCurrent && 'bg-blue-50 border-l-4 border-blue-600'
                          )}
                        >
                          <div className='flex items-center space-x-3'>
                            <div className='w-8 h-8 rounded-full flex items-center justify-center shrink-0'>
                              {completed ? (
                                <CheckCircle className='w-5 h-5 text-green-600' />
                              ) : isEnrolled ? (
                                <Play className='w-4 h-4 text-gray-400' />
                              ) : (
                                <Lock className='w-4 h-4 text-gray-400' />
                              )}
                            </div>
                            <div>
                              <span
                                className={cn(
                                  'text-sm',
                                  completed ? 'text-gray-500' : 'text-gray-900',
                                  isCurrent && 'font-medium text-blue-600'
                                )}
                              >
                                {lessonIndex + 1}. {lesson.title}
                              </span>
                            </div>
                          </div>
                          <span className='text-xs text-gray-500 shrink-0'>
                            {lesson.duration}:00
                          </span>
                        </button>
                      );
                    })}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default Curriculum;
