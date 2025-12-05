'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Users,
  BarChart3,
  FileText,
  ClipboardList,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { fetchCurrentUser, logoutUser } from '@/redux/features/authSlice';
import { toggleSidebar } from '@/redux/features/uiSlice';
import { getInitials } from '@/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, isAuthenticated, isLoading]);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Courses', href: '/admin/course', icon: BookOpen },
    { name: 'Students', href: '/admin/students', icon: Users },
    { name: 'Assignments', href: '/admin/assignments', icon: FileText },
    { name: 'Quizzes', href: '/admin/quizzes', icon: ClipboardList },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  ];

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-linear-to-b from-blue-600 to-purple-700 text-white transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className='flex flex-col h-full'>
          {/* Logo */}
          <div className='flex items-center justify-between h-16 px-6 border-b border-white/10'>
            <Link href='/admin' className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center'>
                <GraduationCap className='w-5 h-5' />
              </div>
              <span className='text-xl font-bold'>Admin Panel</span>
            </Link>
            <button
              onClick={() => dispatch(toggleSidebar())}
              className='lg:hidden p-2 rounded-lg hover:bg-white/10'
            >
              <X className='w-5 h-5' />
            </button>
          </div>

          {/* Navigation */}
          <nav className='flex-1 px-4 py-6 space-y-2 overflow-y-auto'>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className='flex items-center space-x-3 px-4 py-3 text-white/80 rounded-lg hover:bg-white/10 hover:text-white transition-colors'
              >
                <item.icon className='w-5 h-5' />
                <span className='font-medium'>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Profile */}
          {user && (
            <div className='p-4 border-t border-white/10'>
              <div className='flex items-center space-x-3 mb-3'>
                <div className='w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-semibold'>
                  {getInitials(user.name)}
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium text-white truncate'>{user.name}</p>
                  <p className='text-xs text-white/70 truncate'>Administrator</p>
                </div>
              </div>
              <Button
                variant='outline'
                className='w-full bg-white/10 border-white/20 text-white hover:bg-white/20'
                onClick={handleLogout}
              >
                <LogOut className='w-4 h-4 mr-2' />
                Logout
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className='lg:pl-64'>
        {/* Mobile Header */}
        <header className='lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200'>
          <div className='flex items-center justify-between h-16 px-4'>
            <button
              onClick={() => dispatch(toggleSidebar())}
              className='p-2 rounded-lg hover:bg-gray-100'
            >
              <Menu className='w-6 h-6' />
            </button>
            <div className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'>
                <GraduationCap className='w-5 h-5 text-white' />
              </div>
              <span className='text-lg font-bold'>Admin Panel</span>
            </div>
            <div className='w-10' />
          </div>
        </header>

        {/* Page Content */}
        <main className='min-h-screen p-6'>{children}</main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-40 lg:hidden'
          onClick={() => dispatch(toggleSidebar())}
        />
      )}
    </div>
  );
}
