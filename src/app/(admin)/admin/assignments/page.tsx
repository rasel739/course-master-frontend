'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, FileText, Users, CheckCircle, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/utils';
import AssignmentDialog from '@/components/admin/assignment-dialog';

// Mock data - replace with actual API call
const mockAssignments = [
  {
    _id: '1',
    title: 'Build a React Component',
    course: { _id: 'c1', title: 'React Fundamentals' },
    module: 'm1',
    description: 'Create a reusable button component with props',
    submissions: [
      { _id: 's1', user: 'u1', grade: 85, submittedAt: '2024-01-15' },
      { _id: 's2', user: 'u2', grade: undefined, submittedAt: '2024-01-16' },
    ],
    createdAt: '2024-01-10',
  },
  {
    _id: '2',
    title: 'Database Design Project',
    course: { _id: 'c2', title: 'Database Fundamentals' },
    module: 'm2',
    description: 'Design a normalized database schema',
    submissions: [{ _id: 's3', user: 'u3', grade: 92, submittedAt: '2024-01-14' }],
    createdAt: '2024-01-08',
  },
];

export default function AdminAssignmentsPage() {
  const router = useRouter();
  const [assignments] = useState(mockAssignments);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistics
  const totalAssignments = assignments.length;
  const totalSubmissions = assignments.reduce((sum, a) => sum + a.submissions.length, 0);
  const gradedSubmissions = assignments.reduce(
    (sum, a) => sum + a.submissions.filter((s) => s.grade !== undefined).length,
    0
  );
  const pendingGrading = totalSubmissions - gradedSubmissions;

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Assignment Management</h1>
          <p className='text-gray-600 mt-2'>Create and manage course assignments</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className='w-4 h-4 mr-2' />
          Create Assignment
        </Button>
      </div>

      {/* Statistics */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                <FileText className='w-6 h-6 text-blue-600' />
              </div>
            </div>
            <h3 className='text-3xl font-bold text-gray-900 mb-1'>{totalAssignments}</h3>
            <p className='text-sm text-gray-600'>Total Assignments</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center'>
                <Users className='w-6 h-6 text-purple-600' />
              </div>
            </div>
            <h3 className='text-3xl font-bold text-gray-900 mb-1'>{totalSubmissions}</h3>
            <p className='text-sm text-gray-600'>Total Submissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
                <CheckCircle className='w-6 h-6 text-green-600' />
              </div>
            </div>
            <h3 className='text-3xl font-bold text-gray-900 mb-1'>{gradedSubmissions}</h3>
            <p className='text-sm text-gray-600'>Graded</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center'>
                <Clock className='w-6 h-6 text-orange-600' />
              </div>
            </div>
            <h3 className='text-3xl font-bold text-gray-900 mb-1'>{pendingGrading}</h3>
            <p className='text-sm text-gray-600'>Pending Grading</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
        <Input
          type='text'
          placeholder='Search assignments...'
          className='pl-10'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Assignments Table */}
      <Card>
        <CardContent className='p-0'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 border-b'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Assignment
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Course
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Submissions
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Graded
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
                {filteredAssignments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className='px-6 py-12 text-center text-gray-500'>
                      No assignments found
                    </td>
                  </tr>
                ) : (
                  filteredAssignments.map((assignment) => {
                    const graded = assignment.submissions.filter(
                      (s) => s.grade !== undefined
                    ).length;
                    const pending = assignment.submissions.length - graded;

                    return (
                      <tr key={assignment._id} className='hover:bg-gray-50'>
                        <td className='px-6 py-4'>
                          <div>
                            <p className='font-medium text-gray-900'>{assignment.title}</p>
                            <p className='text-sm text-gray-500 line-clamp-1'>
                              {assignment.description}
                            </p>
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <span className='px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800'>
                            {assignment.course.title}
                          </span>
                        </td>
                        <td className='px-6 py-4'>
                          <span className='text-sm font-medium text-gray-900'>
                            {assignment.submissions.length}
                          </span>
                        </td>
                        <td className='px-6 py-4'>
                          <div className='flex items-center space-x-2'>
                            <span className='text-sm text-green-600 font-medium'>{graded}</span>
                            {pending > 0 && (
                              <>
                                <span className='text-gray-400'>/</span>
                                <span className='text-sm text-orange-600 font-medium'>
                                  {pending} pending
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-500'>
                          {formatDate(assignment.createdAt)}
                        </td>
                        <td className='px-6 py-4 text-right'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => router.push(`/admin/assignments/${assignment._id}`)}
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

      {/* Create Assignment Dialog */}
      {dialogOpen && <AssignmentDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />}
    </div>
  );
}
