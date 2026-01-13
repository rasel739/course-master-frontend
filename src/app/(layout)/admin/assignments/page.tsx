'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/utils';
import AssignmentDialog from '@/components/admin/assignment-dialog';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { fetchAssignments } from '@/redux/features/adminSlice';
import Loading from '@/app/loading';
import StatsCard from '@/components/admin/stats_card';
import { IAssinmentAnalytics } from '@/types';
import { ASSIGNMENT_ANALYTICS_STATS, ASSIGNMENT_TABLE_ITEMS } from '@/constants';

const AdminAssignmentsPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { assignments, isLoading } = useAppSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAssignments());
  }, [dispatch]);

  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (typeof assignment.course === 'object' &&
        assignment?.course?.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalAssignments = assignments.length;
  const totalSubmissions = assignments.reduce((sum, a) => sum + (a.submissions?.length || 0), 0);
  const gradedSubmissions = assignments.reduce(
    (sum, a) => sum + (a.submissions?.filter((s) => s.grade !== undefined).length || 0),
    0
  );
  const pendingGrading = totalSubmissions - gradedSubmissions;

  if (isLoading) {
    return <Loading />;
  }

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
      <StatsCard
        analytics={{
          totalAssignments,
          totalSubmissions,
          gradedSubmissions,
          pendingGrading,
        }}
        ANALYTICS_STATS={(data) => ASSIGNMENT_ANALYTICS_STATS(data as IAssinmentAnalytics)}
      />

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
                  {ASSIGNMENT_TABLE_ITEMS.map((item, index) => (
                    <th key={index} className={item.style}>
                      {item.title}
                    </th>
                  ))}
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
                    const graded =
                      assignment.submissions?.filter((s) => s.grade !== undefined).length || 0;
                    const pending = (assignment.submissions?.length || 0) - graded;
                    const courseTitle =
                      typeof assignment.course === 'object'
                        ? assignment?.course?.title
                        : 'Unknown Course';

                    return (
                      <tr key={assignment._id} className='hover:bg-gray-50'>
                        <td className='px-6 py-4'>
                          <div>
                            <p className='font-medium text-gray-900'>{assignment?.title}</p>
                            <p className='text-sm text-gray-500 line-clamp-1'>
                              {assignment.description}
                            </p>
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <span className='px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800'>
                            {courseTitle}
                          </span>
                        </td>
                        <td className='px-6 py-4'>
                          <span className='text-sm font-medium text-gray-900'>
                            {assignment.submissions?.length || 0}
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
};

export default AdminAssignmentsPage;
