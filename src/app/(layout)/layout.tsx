'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { fetchCurrentUser } from '@/redux/features/authSlice';
import { fetchUnreadCount } from '@/redux/features/chatSlice';
import { toggleSidebar } from '@/redux/features/uiSlice';
import { Icons } from '@/lib/icons';
import Sidebar from '@/components/layout/sidebar';
import Loading from '../loading';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  const abortControllerRef = useRef<AbortController | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitializedAuth = useRef(false);

  const handleToggleSidebar = useCallback(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);

  useEffect(() => {
    if (hasInitializedAuth.current) return;

    const token = Cookies.get('accessToken');

    if (!token && !user) {
      router.replace('/login');
      return;
    }

    if (token && !user && !isLoading) {
      hasInitializedAuth.current = true;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      dispatch(fetchCurrentUser())
        .unwrap()
        .catch((error) => {
          if (error.name !== 'AbortError') {
            Cookies.remove('accessToken');
            router.replace('/login');
          }
        });
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [user, isLoading, router, dispatch]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      return;
    }

    dispatch(fetchUnreadCount());

    pollIntervalRef.current = setInterval(() => {
      dispatch(fetchUnreadCount());
    }, 30000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [dispatch, isAuthenticated, user]);

  if (isLoading && !user) {
    return <Loading />;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className='lg:pl-64'>
        {/* Mobile Header */}
        <header className='lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200'>
          <div className='flex items-center justify-between h-16 px-4'>
            <button
              onClick={handleToggleSidebar}
              className='p-2 rounded-lg hover:bg-gray-100 transition-colors'
              aria-label='Toggle sidebar'
            >
              <Icons.Menu className='w-6 h-6' />
            </button>
            <div className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'>
                <Icons.Logo className='w-5 h-5 text-white' />
              </div>
              <span className='text-lg font-bold'>Course Master</span>
            </div>
            <div className='w-10' />
          </div>
        </header>

        {/* Page Content */}
        <main className='min-h-screen p-3 sm:p-4 lg:p-6'>{children}</main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity'
          onClick={handleToggleSidebar}
          aria-hidden='true'
        />
      )}
    </div>
  );
}
