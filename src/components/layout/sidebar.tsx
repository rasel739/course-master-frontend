'use client';
import { Icons } from '@/lib/icons';
import { logoutUser } from '@/redux/features/authSlice';
import { toggleSidebar } from '@/redux/features/uiSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { getInitials } from '@/utils';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { SidebarItems } from '@/constants/sidebarItems';
import { USER_ROLE } from '@/constants/role';
import { useMemo } from 'react';
import Loading from '@/app/loading';

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);

  const adminRole = user?.role === USER_ROLE.ADMIN;

  const sidebarItems = useMemo(() => SidebarItems(user?.role || ''), [user?.role]);

  if (!user) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      router.push('/login');
    } catch {
      router.push('/login');
    }
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 ${
        adminRole
          ? 'bg-linear-to-b from-blue-600 to-purple-700 text-white'
          : 'bg-white border-r border-gray-200'
      }  transform transition-transform duration-200 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
    >
      <div className='flex flex-col h-full'>
        {/* Logo */}
        <div
          className={`flex items-center justify-between h-16 px-6 border-b ${
            adminRole ? 'border-white/10' : 'border-gray-200'
          }`}
        >
          <Link href='/' className='flex items-center space-x-2'>
            <div
              className={`w-8 h-8 ${
                adminRole
                  ? 'bg-white/20 backdrop-blur-sm'
                  : 'bg-linear-to-br from-blue-600 to-purple-600'
              } rounded-lg flex items-center justify-center`}
            >
              <Icons.Logo className='w-5 h-5 text-white' />
            </div>
            <span className='text-xl font-bold'>Course Master</span>
          </Link>
          <button
            onClick={() => dispatch(toggleSidebar())}
            className={`lg:hidden p-2 rounded-lg ${
              adminRole ? 'hover:bg-white/10' : 'hover:bg-gray-100'
            }`}
          >
            <Icons.Close className='w-5 h-5' />
          </button>
        </div>

        {/* Navigation */}
        <nav className='flex-1 px-4 py-6 space-y-2 overflow-y-auto'>
          {sidebarItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center justify-between px-4 py-3 ${
                adminRole
                  ? 'text-white/80 rounded-lg hover:bg-white/10 hover:text-white'
                  : 'text-gray-700 rounded-lg hover:bg-gray-100'
              } transition-colors`}
            >
              <div className='flex items-center space-x-3'>
                <item.icon className='w-5 h-5' />
                <span className='font-medium'>{item.name}</span>
              </div>
              {item.badge && (
                <span className='flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-bold text-white bg-indigo-600 rounded-full'>
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        {user && (
          <div className={`p-4 border-t ${adminRole ? 'border-white/10' : 'border-gray-200'}`}>
            <div className='flex items-center space-x-3 mb-3'>
              <div
                className={`w-10 h-10 ${
                  adminRole
                    ? 'bg-white/20 backdrop-blur-sm'
                    : 'bg-linear-to-br from-blue-600 to-purple-600'
                } rounded-full flex items-center justify-center text-white font-semibold`}
              >
                {getInitials(user?.name)}
              </div>
              <div className='flex-1 min-w-0'>
                <p
                  className={`text-sm font-medium ${
                    adminRole ? 'text-white' : 'text-gray-900'
                  }  truncate`}
                >
                  {user.name}
                </p>
                <p className={`text-xs ${adminRole ? 'text-white/70' : 'text-gray-500'} truncate`}>
                  {adminRole ? 'Administrator' : user?.email}
                </p>
              </div>
            </div>
            <Button
              variant='outline'
              className={`w-full ${
                adminRole && 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
              onClick={handleLogout}
            >
              <Icons.LogOut className='w-4 h-4 mr-2' />
              Logout
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
