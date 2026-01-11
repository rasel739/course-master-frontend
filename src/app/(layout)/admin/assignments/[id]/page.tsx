'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Users, CheckCircle, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils';
import { adminApi } from '@/helpers/axios/api';
import Loading from '@/app/loading';
import { Assignment } from '@/types';

interface Submission {
  _id: string;
  user: { _id: string; name: string; email: string } | string;
  submissionType: 'text' | 'link';
  content: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
}

export default function AdminAssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await adminApi.getAssignments();
        const assignments = response.data.data?.assignments || [];
        const found = assignments.find((a: Assignment) => a._id === params.id);
        if (found) {
          setAssignment(found);
        } else {
          setError('Assignment not found');
        }
      } catch (err) {
        console.error('Error fetching assignment:', err);
        setError('Failed to load assignment');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchAssignment();
    }
  }, [params.id]);

  if (isLoading) {
    return <Loading />;
  }

  if (error || !assignment) {
    return (
      <div className='space-y-6'>
        <Button variant='ghost' onClick={() => router.back()}>
          <ArrowLeft className='w-4 h-4 mr-2' />
          Back
        </Button>
        <Card>
          <CardContent className='p-12 text-center'>
            <p className='text-gray-600'>{error || 'Assignment not found'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const submissions = assignment.submissions || [];
  const gradedCount = submissions.filter((s: Submission) => s.grade !== undefined).length;
  const pendingCount = submissions.length - gradedCount;
  const courseTitle =
    typeof assignment.course === 'object' ? assignment?.course?.title : 'Unknown Course';

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
            <h1 className='text-2xl font-bold text-gray-900'>{assignment.title}</h1>
            <p className='text-gray-600'>{courseTitle}</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                <Users className='w-5 h-5 text-blue-600' />
              </div>
              <div>
                <p className='text-2xl font-bold text-gray-900'>{submissions.length}</p>
                <p className='text-sm text-gray-600'>Submissions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center'>
                <CheckCircle className='w-5 h-5 text-green-600' />
              </div>
              <div>
                <p className='text-2xl font-bold text-gray-900'>{gradedCount}</p>
                <p className='text-sm text-gray-600'>Graded</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center'>
                <Clock className='w-5 h-5 text-orange-600' />
              </div>
              <div>
                <p className='text-2xl font-bold text-gray-900'>{pendingCount}</p>
                <p className='text-sm text-gray-600'>Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center'>
                <FileText className='w-5 h-5 text-purple-600' />
              </div>
              <div>
                <p className='text-sm font-medium text-gray-900'>Created</p>
                <p className='text-sm text-gray-600'>{formatDate(assignment.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-gray-600'>{assignment.description}</p>
        </CardContent>
      </Card>

      {/* Submissions */}
      <Card>
        <CardHeader>
          <CardTitle>Student Submissions</CardTitle>
        </CardHeader>
        <CardContent className='p-0'>
          {submissions.length === 0 ? (
            <div className='p-12 text-center text-gray-500'>No submissions yet</div>
          ) : (
            <div className='divide-y'>
              {submissions.map((submission: Submission) => {
                const userName =
                  typeof submission.user === 'object' ? submission.user.name : 'Unknown User';
                const userEmail = typeof submission.user === 'object' ? submission.user.email : '';

                return (
                  <div key={submission._id} className='p-4 hover:bg-gray-50'>
                    <div className='flex items-start justify-between'>
                      <div className='flex items-start space-x-3'>
                        <div className='w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center'>
                          <User className='w-5 h-5 text-gray-600' />
                        </div>
                        <div>
                          <p className='font-medium text-gray-900'>{userName}</p>
                          <p className='text-sm text-gray-500'>{userEmail}</p>
                          <p className='text-xs text-gray-400 mt-1'>
                            Submitted: {formatDate(submission.submittedAt)}
                          </p>
                        </div>
                      </div>
                      <div className='text-right'>
                        {submission.grade !== undefined ? (
                          <Badge variant='success'>{submission.grade}/100</Badge>
                        ) : (
                          <Badge variant='secondary'>Pending</Badge>
                        )}
                        <Badge variant='outline' className='ml-2'>
                          {submission.submissionType}
                        </Badge>
                      </div>
                    </div>
                    <div className='mt-3 ml-13 p-3 bg-gray-50 rounded-lg'>
                      <p className='text-sm text-gray-600'>
                        {submission.submissionType === 'link' ? (
                          <a
                            href={submission.content}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-600 hover:underline'
                          >
                            {submission.content}
                          </a>
                        ) : (
                          submission.content
                        )}
                      </p>
                    </div>
                    {submission.feedback && (
                      <div className='mt-2 ml-13 p-3 bg-blue-50 rounded-lg'>
                        <p className='text-sm font-medium text-blue-900'>Feedback:</p>
                        <p className='text-sm text-blue-700'>{submission.feedback}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
