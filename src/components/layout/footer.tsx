import { GraduationCap } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className='border-t bg-white py-8 md:py-12'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col items-center space-y-4 md:flex-row md:justify-between md:space-y-0'>
          <Link href='/' className='flex items-center space-x-2'>
            <div className='w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'>
              <GraduationCap className='w-5 h-5 text-white' />
            </div>
            <span className='text-lg sm:text-xl font-bold'>Course Master</span>
          </Link>
          <div className='text-gray-600 text-sm text-center'>
            © {new Date().getFullYear()} Course Master. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
