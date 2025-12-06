'use client';

import { GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useAppSelector } from '@/redux/hook';

const Header = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <header className='border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          <Link href='/' className='flex items-center space-x-2'>
            <div className='w-8 h-8 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'>
              <GraduationCap className='w-5 h-5 text-white' />
            </div>
            <span className='text-xl font-bold'>Course Master</span>
          </Link>

          <nav className='hidden md:flex items-center space-x-6'>
            <Link href='/courses' className='text-gray-600 hover:text-gray-900 transition-colors'>
              Course
            </Link>
            <Link href='/about' className='text-gray-600 hover:text-gray-900 transition-colors'>
              About
            </Link>
          </nav>

          <div className='flex items-center space-x-4'>
            {isAuthenticated ? (
              <Link href='/dashboard'>
                <Button>Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href='/login'>
                  <Button variant='ghost'>Login</Button>
                </Link>
                <Link href='/register'>
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
