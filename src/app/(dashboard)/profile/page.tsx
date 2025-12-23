'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Globe,
    Camera,
    Edit2,
    Award,
    BookOpen,
    Clock,
    TrendingUp,
    Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { fetchDashboard } from '@/redux/features/enrollmentSlice';
import { formatDate } from '@/utils';

const ProfilePage = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { enrollments } = useAppSelector((state) => state.enrollment);
    const [isEditing, setIsEditing] = useState(false);

    // Fetch enrollments on mount
    useEffect(() => {
        dispatch(fetchDashboard());
    }, [dispatch]);

    const stats = [
        {
            label: 'Courses Enrolled',
            value: enrollments?.length || 0,
            icon: BookOpen,
            color: 'text-blue-600 bg-blue-100',
        },
        {
            label: 'Completed',
            value: enrollments?.filter((e) => e.progress === 100).length || 0,
            icon: Award,
            color: 'text-green-600 bg-green-100',
        },
        {
            label: 'In Progress',
            value: enrollments?.filter((e) => e.progress > 0 && e.progress < 100).length || 0,
            icon: TrendingUp,
            color: 'text-purple-600 bg-purple-100',
        },
        {
            label: 'Certificates',
            value: enrollments?.filter((e) => e.progress === 100).length || 0,
            icon: Award,
            color: 'text-orange-600 bg-orange-100',
        },
    ];

    // Dynamic achievements based on actual user data
    const completedCourses = enrollments?.filter((e) => e.progress === 100).length || 0;
    const enrolledCourses = enrollments?.length || 0;

    const achievements = [
        {
            title: 'First Steps',
            description: 'Enrolled in your first course',
            earned: enrolledCourses >= 1
        },
        {
            title: 'Course Completed',
            description: 'Completed your first course',
            earned: completedCourses >= 1
        },
        {
            title: 'Active Learner',
            description: 'Enrolled in 3 or more courses',
            earned: enrolledCourses >= 3
        },
        {
            title: 'Achiever',
            description: 'Complete 3 courses',
            earned: completedCourses >= 3
        },
        {
            title: 'Course Master',
            description: 'Complete 5 courses',
            earned: completedCourses >= 5
        },
        {
            title: 'Learning Legend',
            description: 'Complete 10 courses',
            earned: completedCourses >= 10
        },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Profile Header */}
            <Card>
                <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            <Avatar
                                size="2xl"
                                src={user?.avatar}
                                fallback={user?.name}
                                className="ring-4 ring-blue-100"
                            />
                            <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                                <Camera className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                                    <p className="text-gray-600">{user?.email}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant={user?.role === 'admin' ? 'purple' : 'secondary'}>
                                            {user?.role === 'admin' ? 'Admin' : 'Student'}
                                        </Badge>
                                        <span className="text-sm text-gray-500">
                                            Member since {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditing(!isEditing)}
                                >
                                    <Edit2 className="w-4 h-4 mr-2" />
                                    {isEditing ? 'Cancel' : 'Edit Profile'}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="bg-gray-50 rounded-xl p-4 flex items-center gap-3"
                            >
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-sm text-gray-600">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="about">
                <TabsList>
                    <TabsTrigger value="about">About</TabsTrigger>
                    <TabsTrigger value="achievements">Achievements</TabsTrigger>
                    <TabsTrigger value="certificates">Certificates</TabsTrigger>
                </TabsList>

                <TabsContent value="about">
                    <Card>
                        <CardHeader>
                            <CardTitle>About Me</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isEditing ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input id="name" defaultValue={user?.name} />
                                        </div>
                                        <div>
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" defaultValue={user?.email} disabled />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="bio">Bio</Label>
                                        <Textarea
                                            id="bio"
                                            placeholder="Tell us about yourself..."
                                            rows={4}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="location">Location</Label>
                                            <Input id="location" placeholder="City, Country" />
                                        </div>
                                        <div>
                                            <Label htmlFor="website">Website</Label>
                                            <Input id="website" placeholder="https://" />
                                        </div>
                                    </div>
                                    <Button>Save Changes</Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="font-medium text-gray-900 mb-2">Learning Summary</h4>
                                        <p className="text-gray-600">
                                            {enrolledCourses > 0
                                                ? `Currently enrolled in ${enrolledCourses} course${enrolledCourses > 1 ? 's' : ''} with ${completedCourses} completed.`
                                                : 'No courses enrolled yet. Start learning today!'}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <User className="w-4 h-4" />
                                            <span>{user?.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Mail className="w-4 h-4" />
                                            <span>{user?.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Briefcase className="w-4 h-4" />
                                            <span className="capitalize">{user?.role}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Calendar className="w-4 h-4" />
                                            <span>Joined {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="achievements">
                    <Card>
                        <CardHeader>
                            <CardTitle>Achievements</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {achievements.map((achievement) => (
                                    <div
                                        key={achievement.title}
                                        className={`p-4 rounded-lg border-2 ${achievement.earned
                                            ? 'border-yellow-400 bg-yellow-50'
                                            : 'border-gray-200 bg-gray-50 opacity-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-12 h-12 rounded-full flex items-center justify-center ${achievement.earned
                                                    ? 'bg-yellow-400 text-yellow-900'
                                                    : 'bg-gray-300 text-gray-600'
                                                    }`}
                                            >
                                                <Award className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                                                <p className="text-sm text-gray-600">{achievement.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="certificates">
                    <Card>
                        <CardHeader>
                            <CardTitle>Certificates</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {enrollments?.filter((e) => e.progress === 100).length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {enrollments
                                        .filter((e) => e.progress === 100)
                                        .map((enrollment) => (
                                            <div
                                                key={enrollment._id}
                                                className="p-6 border-2 border-blue-200 bg-blue-50 rounded-xl"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white">
                                                        <Award className="w-8 h-8" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">
                                                            {(enrollment.course as { title: string }).title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">Certificate of Completion</p>
                                                        <Button variant="link" className="p-0 h-auto text-blue-600">
                                                            Download Certificate
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        No Certificates Yet
                                    </h3>
                                    <p className="text-gray-600">
                                        Complete a course to earn your first certificate!
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ProfilePage;
