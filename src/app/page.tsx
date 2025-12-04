import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Award, ArrowRight, CheckCircle } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function Home() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      <Header />

      {/* Hero Section */}
      <section className='container mx-auto px-4 py-20 md:py-32'>
        <div className='max-w-4xl mx-auto text-center'>
          <h1 className='text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
            Learn Anything, Anywhere
          </h1>
          <p className='text-xl text-gray-600 mb-8 max-w-2xl mx-auto'>
            Master new skills with expert-led courses. Join thousands of students learning from the
            best instructors around the world.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link href='/register'>
              <Button size='lg' className='w-full sm:w-auto'>
                Start Learning
                <ArrowRight className='ml-2 w-4 h-4' />
              </Button>
            </Link>
            <Link href='/courses'>
              <Button size='lg' variant='outline' className='w-full sm:w-auto'>
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className='container mx-auto px-4 py-16'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
            <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4'>
              <BookOpen className='w-6 h-6 text-blue-600' />
            </div>
            <h3 className='text-xl font-semibold mb-2'>Expert Instructors</h3>
            <p className='text-gray-600'>
              Learn from industry professionals with years of real-world experience.
            </p>
          </div>

          <div className='bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
            <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4'>
              <Users className='w-6 h-6 text-purple-600' />
            </div>
            <h3 className='text-xl font-semibold mb-2'>Active Community</h3>
            <p className='text-gray-600'>
              Join a thriving community of learners and share your journey.
            </p>
          </div>

          <div className='bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
            <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4'>
              <Award className='w-6 h-6 text-green-600' />
            </div>
            <h3 className='text-xl font-semibold mb-2'>Certificates</h3>
            <p className='text-gray-600'>
              Earn recognized certificates upon completing your courses.
            </p>
          </div>
        </div>
      </section>

      <section className='bg-gradient-to-r from-blue-600 to-purple-600 py-16'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white'>
            <div>
              <div className='text-4xl font-bold mb-2'>150+</div>
              <div className='text-blue-100'>Courses</div>
            </div>
            <div>
              <div className='text-4xl font-bold mb-2'>5,000+</div>
              <div className='text-blue-100'>Students</div>
            </div>
            <div>
              <div className='text-4xl font-bold mb-2'>50+</div>
              <div className='text-blue-100'>Instructors</div>
            </div>
            <div>
              <div className='text-4xl font-bold mb-2'>87%</div>
              <div className='text-blue-100'>Completion Rate</div>
            </div>
          </div>
        </div>
      </section>

      <section className='container mx-auto px-4 py-16'>
        <div className='max-w-4xl mx-auto'>
          <h2 className='text-3xl md:text-4xl font-bold text-center mb-12'>
            Why Choose Course Master?
          </h2>
          <div className='space-y-6'>
            {[
              'Access to high-quality courses from industry experts',
              'Learn at your own pace with lifetime access',
              'Interactive assignments and quizzes to test your knowledge',
              'Get certified and boost your career opportunities',
              'Join a supportive community of learners',
            ].map((feature, index) => (
              <div key={index} className='flex items-start space-x-3'>
                <CheckCircle className='w-6 h-6 text-green-600 flex-shrink-0 mt-0.5' />
                <p className='text-lg text-gray-700'>{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='container mx-auto px-4 py-16'>
        <div className='bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>Ready to Start Learning?</h2>
          <p className='text-xl text-blue-100 mb-8 max-w-2xl mx-auto'>
            Join thousands of students already learning on Course Master
          </p>
          <Link href='/register'>
            <Button
              size='lg'
              variant='secondary'
              className='bg-white text-blue-600 hover:bg-gray-100'
            >
              Get Started for Free
              <ArrowRight className='ml-2 w-4 h-4' />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
