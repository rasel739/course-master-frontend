'use client';

import { useState } from 'react';
import {
    User,
    Bell,
    Shield,
    Eye,
    Mail,
    Smartphone,
    Globe,
    Moon,
    Sun,
    CreditCard,
    LogOut,
    Trash2,
    ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select } from '@/components/ui/select';
import { useAppSelector, useAppDispatch } from '@/redux/hook';
import { logoutUser } from '@/redux/features/authSlice';
import { useRouter } from 'next/navigation';

const SettingsPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);

    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        marketing: false,
        courseUpdates: true,
        newCourses: true,
    });

    const handleLogout = async () => {
        await dispatch(logoutUser());
        router.push('/login');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
            </div>

            <Tabs defaultValue="account">
                <TabsList className="mb-6">
                    <TabsTrigger value="account">
                        <User className="w-4 h-4 mr-2" />
                        Account
                    </TabsTrigger>
                    <TabsTrigger value="notifications">
                        <Bell className="w-4 h-4 mr-2" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="privacy">
                        <Shield className="w-4 h-4 mr-2" />
                        Privacy
                    </TabsTrigger>
                    <TabsTrigger value="billing">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Billing
                    </TabsTrigger>
                </TabsList>

                {/* Account Tab */}
                <TabsContent value="account">
                    <div className="space-y-6">
                        {/* Profile Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>Update your account profile information</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" defaultValue={user?.name} />
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input id="email" defaultValue={user?.email} disabled />
                                    </div>
                                </div>
                                <Button>Save Changes</Button>
                            </CardContent>
                        </Card>

                        {/* Password */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Change Password</CardTitle>
                                <CardDescription>Update your password to keep your account secure</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="currentPassword">Current Password</Label>
                                    <Input id="currentPassword" type="password" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <Input id="newPassword" type="password" />
                                    </div>
                                    <div>
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <Input id="confirmPassword" type="password" />
                                    </div>
                                </div>
                                <Button>Update Password</Button>
                            </CardContent>
                        </Card>

                        {/* Preferences */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Preferences</CardTitle>
                                <CardDescription>Customize your experience</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Globe className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <p className="font-medium">Language</p>
                                            <p className="text-sm text-gray-500">Select your preferred language</p>
                                        </div>
                                    </div>
                                    <Select
                                        options={[
                                            { value: 'en', label: 'English' },
                                            { value: 'es', label: 'Spanish' },
                                            { value: 'fr', label: 'French' },
                                        ]}
                                        value="en"
                                        className="w-40"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Moon className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <p className="font-medium">Theme</p>
                                            <p className="text-sm text-gray-500">Choose light or dark mode</p>
                                        </div>
                                    </div>
                                    <Select
                                        options={[
                                            { value: 'light', label: 'Light' },
                                            { value: 'dark', label: 'Dark' },
                                            { value: 'system', label: 'System' },
                                        ]}
                                        value="light"
                                        className="w-40"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>Choose how you want to be notified</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="font-medium text-gray-900">Communication Channels</h3>

                                <label className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <p className="font-medium">Email Notifications</p>
                                            <p className="text-sm text-gray-500">Receive notifications via email</p>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={notifications.email}
                                        onChange={(e) =>
                                            setNotifications({ ...notifications, email: e.target.checked })
                                        }
                                        className="w-5 h-5 rounded accent-blue-600"
                                    />
                                </label>

                                <label className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-3">
                                        <Smartphone className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <p className="font-medium">Push Notifications</p>
                                            <p className="text-sm text-gray-500">Receive push notifications on mobile</p>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={notifications.push}
                                        onChange={(e) =>
                                            setNotifications({ ...notifications, push: e.target.checked })
                                        }
                                        className="w-5 h-5 rounded accent-blue-600"
                                    />
                                </label>
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="font-medium text-gray-900">Notification Types</h3>

                                <label className="flex items-center justify-between py-2">
                                    <div>
                                        <p className="font-medium">Course Updates</p>
                                        <p className="text-sm text-gray-500">When your enrolled courses are updated</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={notifications.courseUpdates}
                                        onChange={(e) =>
                                            setNotifications({ ...notifications, courseUpdates: e.target.checked })
                                        }
                                        className="w-5 h-5 rounded accent-blue-600"
                                    />
                                </label>

                                <label className="flex items-center justify-between py-2">
                                    <div>
                                        <p className="font-medium">New Courses</p>
                                        <p className="text-sm text-gray-500">When new courses are added</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={notifications.newCourses}
                                        onChange={(e) =>
                                            setNotifications({ ...notifications, newCourses: e.target.checked })
                                        }
                                        className="w-5 h-5 rounded accent-blue-600"
                                    />
                                </label>

                                <label className="flex items-center justify-between py-2">
                                    <div>
                                        <p className="font-medium">Marketing Emails</p>
                                        <p className="text-sm text-gray-500">Promotions and special offers</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={notifications.marketing}
                                        onChange={(e) =>
                                            setNotifications({ ...notifications, marketing: e.target.checked })
                                        }
                                        className="w-5 h-5 rounded accent-blue-600"
                                    />
                                </label>
                            </div>

                            <Button>Save Preferences</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Privacy Tab */}
                <TabsContent value="privacy">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Privacy Settings</CardTitle>
                                <CardDescription>Control your privacy and visibility</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <label className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-3">
                                        <Eye className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <p className="font-medium">Profile Visibility</p>
                                            <p className="text-sm text-gray-500">Allow others to see your profile</p>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="w-5 h-5 rounded accent-blue-600"
                                    />
                                </label>

                                <label className="flex items-center justify-between py-2">
                                    <div>
                                        <p className="font-medium">Show Learning Progress</p>
                                        <p className="text-sm text-gray-500">Display your progress to other students</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="w-5 h-5 rounded accent-blue-600"
                                    />
                                </label>

                                <label className="flex items-center justify-between py-2">
                                    <div>
                                        <p className="font-medium">Show Certificates</p>
                                        <p className="text-sm text-gray-500">Display earned certificates on your profile</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="w-5 h-5 rounded accent-blue-600"
                                    />
                                </label>
                            </CardContent>
                        </Card>

                        {/* Danger Zone */}
                        <Card className="border-red-200">
                            <CardHeader>
                                <CardTitle className="text-red-600">Danger Zone</CardTitle>
                                <CardDescription>Irreversible actions for your account</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <p className="font-medium text-gray-900">Log Out</p>
                                        <p className="text-sm text-gray-500">Sign out from your account</p>
                                    </div>
                                    <Button variant="outline" onClick={handleLogout}>
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Log Out
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <p className="font-medium text-red-600">Delete Account</p>
                                        <p className="text-sm text-gray-500">Permanently delete your account and data</p>
                                    </div>
                                    <Button variant="destructive">
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Account
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Billing Tab */}
                <TabsContent value="billing">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Methods</CardTitle>
                                <CardDescription>Manage your payment methods</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-4">No payment methods saved</p>
                                    <Button>Add Payment Method</Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Purchase History</CardTitle>
                                <CardDescription>View your past purchases</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    <p className="text-gray-600">No purchase history yet</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SettingsPage;
