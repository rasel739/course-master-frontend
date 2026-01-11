'use client';

import { useState } from 'react';
import { GraduationCap, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useAppSelector } from '@/redux/hook';

const Header = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className='border-b bg-white/80  sticky top-0 z-50'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <Link href='/' className='flex items-center space-x-2'>
            <div className='w-8 h-8 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'>
              <GraduationCap className='w-5 h-5 text-white' />
            </div>
            <span className='text-lg sm:text-xl font-bold'>Course Master</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-6'>
            <Link href='/' className='text-gray-600 hover:text-gray-900 transition-colors'>
              Home
            </Link>
            <Link href='/courses' className='text-gray-600 hover:text-gray-900 transition-colors'>
              Courses
            </Link>
            <Link href='/about' className='text-gray-600 hover:text-gray-900 transition-colors'>
              About
            </Link>
            <Link href='/courses' className='text-gray-600 hover:text-gray-900 transition-colors'>
              Contact
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className='hidden md:flex items-center space-x-4'>
            {isAuthenticated ? (
              <Link href='/student'>
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

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className='md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors'
            aria-label='Toggle mobile menu'
          >
            {mobileMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className='fixed inset-0 bg-black/50 z-40 md:hidden' onClick={closeMobileMenu} />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 max-w-[80vw] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className='flex flex-col h-full'>
          {/* Close Button */}
          <div className='flex items-center justify-between p-4 border-b'>
            <span className='font-bold text-lg'>Menu</span>
            <button
              onClick={closeMobileMenu}
              className='p-2 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <X className='w-5 h-5' />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className='flex-1 p-4 space-y-2'>
            <Link
              href='/courses'
              onClick={closeMobileMenu}
              className='block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium'
            >
              Courses
            </Link>
            <Link
              href='/about'
              onClick={closeMobileMenu}
              className='block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium'
            >
              About
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className='p-4 border-t space-y-3'>
            {isAuthenticated ? (
              <Link href='/student' onClick={closeMobileMenu}>
                <Button className='w-full'>Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href='/login' onClick={closeMobileMenu}>
                  <Button variant='outline' className='w-full'>
                    Login
                  </Button>
                </Link>
                <Link href='/register' onClick={closeMobileMenu}>
                  <Button className='w-full'>Get Started</Button>
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
