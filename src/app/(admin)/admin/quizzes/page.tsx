'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, ClipboardList, Users, TrendingUp, Award, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/utils';
import QuizDialog from '@/components/admin/quiz-dialog';

const mockQuizzes = [
  {
    _id: '1',
    title: 'React Hooks Quiz',
    course: { _id: 'c1', title: 'React Fundamentals' },
    module: 'm1',
    questions: [
      {
        question: 'What is useState?',
        options: ['Hook', 'Component', 'Function', 'Class'],
        correctAnswer: 0,
      },
      {
        question: 'What does useEffect do?',
        options: ['Side effects', 'Styling', 'Routing', 'Testing'],
        correctAnswer: 0,
      },
    ],
    attempts: [
      { _id: 'a1', user: 'u1', score: 100, attemptedAt: '2024-01-15' },
      { _id: 'a2', user: 'u2', score: 50, attemptedAt: '2024-01-16' },
      { _id: 'a3', user: 'u3', score: 100, attemptedAt: '2024-01-17' },
    ],
    createdAt: '2024-01-10',
  },
  {
    _id: '2',
    title: 'SQL Basics Quiz',
    course: { _id: 'c2', title: 'Database Fundamentals' },
    module: 'm2',
    questions: [
      {
        question: 'What is SELECT used for?',
        options: ['Query data', 'Insert data', 'Delete data', 'Update data'],
        correctAnswer: 0,
      },
    ],
    attempts: [{ _id: 'a4', user: 'u4', score: 100, attemptedAt: '2024-01-14' }],
    createdAt: '2024-01-08',
  },
];

const AdminQuizzes = () => {
  const router = useRouter();
  const [quizzes] = useState(mockQuizzes);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistics
  const totalQuizzes = quizzes.length;
  const totalAttempts = quizzes.reduce((sum, q) => sum + q.attempts.length, 0);
  const avgScore =
    totalAttempts > 0
      ? Math.round(
          quizzes.reduce(
            (sum, q) => sum + q.attempts.reduce((s, a) => s + a.score, 0) / q.attempts.length,
            0
          ) / quizzes.length
        )
      : 0;
  const passRate =
    totalAttempts > 0
      ? Math.round(
          (quizzes.reduce((sum, q) => sum + q.attempts.filter((a) => a.score >= 70).length, 0) /
            totalAttempts) *
            100
        )
      : 0;

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Quiz Management</h1>
          <p className='text-gray-600 mt-2'>Create and manage course quizzes</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className='w-4 h-4 mr-2' />
          Create Quiz
        </Button>
      </div>

      {/* Statistics */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                <ClipboardList className='w-6 h-6 text-blue-600' />
              </div>
            </div>
            <h3 className='text-3xl font-bold text-gray-900 mb-1'>{totalQuizzes}</h3>
            <p className='text-sm text-gray-600'>Total Quizzes</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center'>
                <Users className='w-6 h-6 text-purple-600' />
              </div>
            </div>
            <h3 className='text-3xl font-bold text-gray-900 mb-1'>{totalAttempts}</h3>
            <p className='text-sm text-gray-600'>Total Attempts</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
                <TrendingUp className='w-6 h-6 text-green-600' />
              </div>
            </div>
            <h3 className='text-3xl font-bold text-gray-900 mb-1'>{avgScore}%</h3>
            <p className='text-sm text-gray-600'>Average Score</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center'>
                <Award className='w-6 h-6 text-orange-600' />
              </div>
            </div>
            <h3 className='text-3xl font-bold text-gray-900 mb-1'>{passRate}%</h3>
            <p className='text-sm text-gray-600'>Pass Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
        <Input
          type='text'
          placeholder='Search quizzes...'
          className='pl-10'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Quizzes Table */}
      <Card>
        <CardContent className='p-0'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 border-b'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Quiz
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Course
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Questions
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Attempts
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Avg Score
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Created
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredQuizzes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className='px-6 py-12 text-center text-gray-500'>
                      No quizzes found
                    </td>
                  </tr>
                ) : (
                  filteredQuizzes.map((quiz) => {
                    const quizAvgScore =
                      quiz.attempts.length > 0
                        ? Math.round(
                            quiz.attempts.reduce((sum, a) => sum + a.score, 0) /
                              quiz.attempts.length
                          )
                        : 0;

                    return (
                      <tr key={quiz._id} className='hover:bg-gray-50'>
                        <td className='px-6 py-4'>
                          <p className='font-medium text-gray-900'>{quiz.title}</p>
                        </td>
                        <td className='px-6 py-4'>
                          <span className='px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800'>
                            {quiz.course.title}
                          </span>
                        </td>
                        <td className='px-6 py-4'>
                          <span className='text-sm font-medium text-gray-900'>
                            {quiz.questions.length}
                          </span>
                        </td>
                        <td className='px-6 py-4'>
                          <span className='text-sm font-medium text-gray-900'>
                            {quiz.attempts.length}
                          </span>
                        </td>
                        <td className='px-6 py-4'>
                          <div className='flex items-center space-x-2'>
                            <div className='w-16 bg-gray-200 rounded-full h-2'>
                              <div
                                className={`h-2 rounded-full ${
                                  quizAvgScore >= 70
                                    ? 'bg-green-600'
                                    : quizAvgScore >= 50
                                    ? 'bg-yellow-600'
                                    : 'bg-red-600'
                                }`}
                                style={{ width: `${quizAvgScore}%` }}
                              />
                            </div>
                            <span className='text-sm font-medium text-gray-900'>
                              {quizAvgScore}%
                            </span>
                          </div>
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-500'>
                          {formatDate(quiz.createdAt)}
                        </td>
                        <td className='px-6 py-4 text-right'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => router.push(`/admin/quizzes/${quiz._id}`)}
                          >
                            <Eye className='w-4 h-4 mr-1' />
                            View
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create Quiz Dialog */}
      {dialogOpen && <QuizDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />}
    </div>
  );
};
export default AdminQuizzes;
