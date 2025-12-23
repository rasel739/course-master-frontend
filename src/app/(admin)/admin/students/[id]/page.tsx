'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, BookOpen, CheckCircle, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatDate, getInitials } from '@/utils';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { fetchAllEnrollments } from '@/redux/features/adminSlice';
import Loading from '@/app/loading';
import { Course, User as UserType, Enrollment } from '@/types';

export default function AdminStudentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { enrollments, isLoading } = useAppSelector((state) => state.admin);
    const [enrollment, setEnrollment] = useState<Enrollment | null>(null);

    useEffect(() => {
        if (enrollments.length === 0) {
            dispatch(fetchAllEnrollments());
        }
    }, [dispatch, enrollments.length]);

    useEffect(() => {
        if (enrollments.length > 0 && params.id) {
            const found = enrollments.find((e) => e._id === params.id);
            if (found) {
                setEnrollment(found);
            }
        }
    }, [enrollments, params.id]);

    if (isLoading) {
        return <Loading />;
    }

    if (!enrollment) {
        return (
            <div className="space-y-6">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <Card>
                    <CardContent className="p-12 text-center">
                        <p className="text-gray-600">Enrollment not found</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const user = enrollment.user as UserType;
    const course = enrollment.course as Course;
    const completedLessons = enrollment.completedLessons || [];
    const totalLessons = course?.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" onClick={() => router.back()}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {getInitials(user?.name || 'U')}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{user?.name || 'Unknown Student'}</h1>
                            <p className="text-gray-600">{user?.email || ''}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <BookOpen className="w-5 h-5" />
                        <span>Enrolled Course</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{course?.title || 'Unknown Course'}</h3>
                            <p className="text-gray-600 mt-1">{course?.description?.substring(0, 150)}...</p>
                        </div>
                        <Badge variant={enrollment.progress === 100 ? 'success' : 'secondary'}>
                            {enrollment.progress === 100 ? 'Completed' : 'In Progress'}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Progress Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{enrollment.progress}%</p>
                                <p className="text-sm text-gray-600">Progress</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{completedLessons.length}</p>
                                <p className="text-sm text-gray-600">Lessons Done</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Clock className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{totalLessons - completedLessons.length}</p>
                                <p className="text-sm text-gray-600">Remaining</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Enrolled</p>
                                <p className="text-sm text-gray-600">{formatDate(enrollment.enrolledAt)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Progress Bar */}
            <Card>
                <CardHeader>
                    <CardTitle>Course Progress</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Overall Completion</span>
                            <span className="font-medium text-gray-900">{enrollment.progress}%</span>
                        </div>
                        <Progress value={enrollment.progress} className="h-3" />
                        <p className="text-sm text-gray-500 mt-2">
                            {completedLessons.length} of {totalLessons} lessons completed
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Completed Lessons */}
            <Card>
                <CardHeader>
                    <CardTitle>Completed Lessons</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {completedLessons.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            No lessons completed yet
                        </div>
                    ) : (
                        <div className="divide-y">
                            {completedLessons.map((cl, index) => {
                                const module = course?.modules?.find((m) => m._id === cl.moduleId);
                                const lesson = module?.lessons?.find((l) => l._id === cl.lessonId);

                                return (
                                    <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{lesson?.title || 'Unknown Lesson'}</p>
                                                <p className="text-sm text-gray-500">{module?.title || 'Unknown Module'}</p>
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {cl.completedAt ? formatDate(cl.completedAt) : 'N/A'}
                                        </span>
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
