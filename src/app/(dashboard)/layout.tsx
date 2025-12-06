'use client';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, Home, BookOpen, BarChart3, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { fetchCurrentUser, logoutUser } from '@/redux/features/authSlice';
import { toggleSidebar } from '@/redux/features/uiSlice';
import { getInitials } from '@/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  if (user?.role === 'admin') {
    redirect('/admin');
  }
  useEffect(() => {
    const token = Cookies.get('accessToken');

    if (token && !isAuthenticated && !isLoading) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, isAuthenticated, isLoading]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      router.push('/login');
    } catch {
      router.push('/login');
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Course', href: '/courses', icon: BookOpen },
    { name: 'My Enrollments', href: '/enrollment', icon: BarChart3 },
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className='flex flex-col h-full'>
          {/* Logo */}
          <div className='flex items-center justify-between h-16 px-6 border-b border-gray-200'>
            <Link href='/' className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'>
                <GraduationCap className='w-5 h-5 text-white' />
              </div>
              <span className='text-xl font-bold'>Course Master</span>
            </Link>
            <button
              onClick={() => dispatch(toggleSidebar())}
              className='lg:hidden p-2 rounded-lg hover:bg-gray-100'
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
                className='flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors'
              >
                <item.icon className='w-5 h-5' />
                <span className='font-medium'>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Profile */}
          {user && (
            <div className='p-4 border-t border-gray-200'>
              <div className='flex items-center space-x-3 mb-3'>
                <div className='w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold'>
                  {getInitials(user.name)}
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium text-gray-900 truncate'>{user.name}</p>
                  <p className='text-xs text-gray-500 truncate'>{user.email}</p>
                </div>
              </div>
              <Button variant='outline' className='w-full' onClick={handleLogout}>
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
              <span className='text-lg font-bold'>Course Master</span>
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
