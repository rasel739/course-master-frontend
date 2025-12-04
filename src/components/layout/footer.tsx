import { GraduationCap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className='border-t bg-white py-12'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col md:flex-row justify-between items-center'>
          <div className='flex items-center space-x-2 mb-4 md:mb-0'>
            <div className='w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'>
              <GraduationCap className='w-5 h-5 text-white' />
            </div>
            <span className='text-xl font-bold'>Course Master</span>
          </div>
          <div className='text-gray-600 text-sm'>
            © {new Date().getFullYear()} Course Master. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
