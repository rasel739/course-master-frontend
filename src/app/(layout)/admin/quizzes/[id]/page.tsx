'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, HelpCircle, Users, TrendingUp, Award, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils';
import { adminApi } from '@/helpers/axios/api';
import Loading from '@/app/loading';
import { Quiz } from '@/types';

interface QuizAttempt {
  _id: string;
  user: { _id: string; name: string; email: string } | string;
  answers: number[];
  score: number;
  attemptedAt: string;
}

export default function AdminQuizDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await adminApi.getQuizzes();
        const quizzes = response.data.data?.quizzes || [];
        const found = quizzes.find((q: Quiz) => q._id === params.id);
        if (found) {
          setQuiz(found);
        } else {
          setError('Quiz not found');
        }
      } catch (err) {
        console.error('Error fetching quiz:', err);
        setError('Failed to load quiz');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchQuiz();
    }
  }, [params.id]);

  if (isLoading) {
    return <Loading />;
  }

  if (error || !quiz) {
    return (
      <div className='space-y-6'>
        <Button variant='ghost' onClick={() => router.back()}>
          <ArrowLeft className='w-4 h-4 mr-2' />
          Back
        </Button>
        <Card>
          <CardContent className='p-12 text-center'>
            <p className='text-gray-600'>{error || 'Quiz not found'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const attempts = quiz.attempts || [];
  const avgScore =
    attempts.length > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
      : 0;
  const passCount = attempts.filter((a) => a.score >= 70).length;
  const passRate = attempts.length > 0 ? Math.round((passCount / attempts.length) * 100) : 0;
  const courseTitle = typeof quiz.course === 'object' ? quiz?.course?.title : 'Unknown Course';

  const quizStats = [
    {
      icon: <HelpCircle className='w-5 h-5' />,
      value: quiz.questions?.length || 0,
      label: 'Questions',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: <Users className='w-5 h-5' />,
      value: attempts.length,
      label: 'Attempts',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      icon: <TrendingUp className='w-5 h-5' />,
      value: `${avgScore}%`,
      label: 'Avg Score',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      icon: <Award className='w-5 h-5' />,
      value: `${passRate}%`,
      label: 'Pass Rate',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Button variant='ghost' onClick={() => router.back()}>
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back
          </Button>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>{quiz.title}</h1>
            <p className='text-gray-600'>{courseTitle}</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        {quizStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className='p-4'>
              <div className='flex items-center space-x-3'>
                <div
                  className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                >
                  <div className={stat.iconColor}>{stat.icon}</div>
                </div>
                <div>
                  <p className='text-2xl font-bold text-gray-900'>{stat.value}</p>
                  <p className='text-sm text-gray-600'>{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Questions</CardTitle>
        </CardHeader>
        <CardContent className='p-0'>
          {!quiz.questions || quiz.questions.length === 0 ? (
            <div className='p-12 text-center text-gray-500'>No questions in this quiz</div>
          ) : (
            <div className='divide-y'>
              {quiz.questions.map((question, index) => (
                <div key={index} className='p-4'>
                  <p className='font-medium text-gray-900 mb-2'>
                    {index + 1}. {question.question}
                  </p>
                  <div className='grid grid-cols-2 gap-2 ml-4'>
                    {question.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`p-2 rounded text-sm ${
                          optIndex === question.correctAnswer
                            ? 'bg-green-100 text-green-800 font-medium'
                            : 'bg-gray-50 text-gray-600'
                        }`}
                      >
                        {String.fromCharCode(65 + optIndex)}. {option}
                        {optIndex === question.correctAnswer && (
                          <span className='ml-2 text-green-600'>✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attempts */}
      <Card>
        <CardHeader>
          <CardTitle>Student Attempts</CardTitle>
        </CardHeader>
        <CardContent className='p-0'>
          {attempts.length === 0 ? (
            <div className='p-12 text-center text-gray-500'>No attempts yet</div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-50 border-b'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Student
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Score
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y'>
                  {attempts.map((attempt: QuizAttempt) => {
                    const userName =
                      typeof attempt.user === 'object' ? attempt.user.name : 'Unknown User';
                    const passed = attempt.score >= 70;

                    return (
                      <tr key={attempt._id} className='hover:bg-gray-50'>
                        <td className='px-6 py-4'>
                          <div className='flex items-center space-x-3'>
                            <div className='w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center'>
                              <User className='w-4 h-4 text-gray-600' />
                            </div>
                            <span className='font-medium text-gray-900'>{userName}</span>
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <div className='flex items-center space-x-2'>
                            <div className='w-16 bg-gray-200 rounded-full h-2'>
                              <div
                                className={`h-2 rounded-full ${
                                  passed ? 'bg-green-600' : 'bg-red-600'
                                }`}
                                style={{ width: `${attempt.score}%` }}
                              />
                            </div>
                            <span className='font-medium text-gray-900'>{attempt.score}%</span>
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <Badge variant={passed ? 'success' : 'destructive'}>
                            {passed ? 'Passed' : 'Failed'}
                          </Badge>
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-500'>
                          {formatDate(attempt.attemptedAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
