import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen, Award, ArrowRight, CheckCircle, Play, Laptop, Globe } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import FeaturedCourses from '@/components/landing/featured-courses';
import Testimonials from '@/components/landing/testimonials';
import Pricing from '@/components/landing/pricing';

export default function Home() {
  return (
    <div className='min-h-screen bg-white'>
      <Header />

      {/* Hero Section - Enhanced */}
      <section className='relative overflow-hidden bg-linear-to-br from-blue-600 via-blue-700 to-purple-700 py-12 sm:py-16 md:py-24 lg:py-32'>
        {/* Background Pattern */}
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-0 left-0 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2' />
          <div className='absolute bottom-0 right-0 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-purple-300 rounded-full blur-3xl translate-x-1/2 translate-y-1/2' />
        </div>

        <div className='container mx-auto px-4 relative z-10'>
          <div className='max-w-4xl mx-auto text-center'>
            <div className='inline-flex items-center bg-white/10 backdrop-blur-sm text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 text-xs sm:text-sm'>
              <span className='w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse' />
              <span className='hidden xs:inline'>Over 50,000 students learning right now</span>
              <span className='xs:hidden'>50,000+ students learning</span>
            </div>

            <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 text-white leading-tight'>
              Learn Skills That
              <span className='block bg-linear-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent'>
                Shape Your Future
              </span>
            </h1>

            <p className='text-base sm:text-lg md:text-xl text-blue-100 mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto px-2'>
              Master in-demand skills with world-class instructors. Get certified and accelerate
              your career with practical, hands-on learning.
            </p>

            <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0'>
              <Link href='/register'>
                <Button
                  size='lg'
                  className='w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg'
                >
                  Start Learning for Free
                  <ArrowRight className='ml-2 w-4 h-4 sm:w-5 sm:h-5' />
                </Button>
              </Link>
              <Link href='/course'>
                <Button
                  size='lg'
                  variant='outline'
                  className='w-full sm:w-auto border-white/30 text-blue-600 hover:bg-white/10 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg'
                >
                  <Play className='mr-2 w-4 h-4 sm:w-5 sm:h-5' fill='currentColor' />
                  Watch Demo
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className='mt-8 sm:mt-10 md:mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 text-white/80 text-xs sm:text-sm px-2'>
              <div className='flex items-center'>
                <CheckCircle className='w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-green-400' />
                <span className='whitespace-nowrap'>30-Day Money Back</span>
              </div>
              <div className='flex items-center'>
                <CheckCircle className='w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-green-400' />
                <span className='whitespace-nowrap'>150+ Expert Courses</span>
              </div>
              <div className='flex items-center'>
                <CheckCircle className='w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-green-400' />
                <span className='whitespace-nowrap'>Lifetime Access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='container mx-auto px-4 py-12 sm:py-16 md:py-20 -mt-8 sm:-mt-12 md:-mt-16 relative z-20'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6'>
          <div className='bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg sm:shadow-xl border border-gray-100 hover-lift'>
            <div className='w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-5'>
              <BookOpen className='w-6 h-6 sm:w-7 sm:h-7 text-blue-600' />
            </div>
            <h3 className='text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900'>
              Expert Instructors
            </h3>
            <p className='text-gray-600 text-sm sm:text-base'>
              Learn from industry professionals with years of real-world experience at top
              companies.
            </p>
          </div>

          <div className='bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg sm:shadow-xl border border-gray-100 hover-lift'>
            <div className='w-12 h-12 sm:w-14 sm:h-14 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-5'>
              <Laptop className='w-6 h-6 sm:w-7 sm:h-7 text-purple-600' />
            </div>
            <h3 className='text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900'>
              Learn Anywhere
            </h3>
            <p className='text-gray-600 text-sm sm:text-base'>
              Access courses on any device. Download for offline learning on mobile.
            </p>
          </div>

          <div className='bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg sm:shadow-xl border border-gray-100 hover-lift sm:col-span-2 md:col-span-1'>
            <div className='w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-5'>
              <Award className='w-6 h-6 sm:w-7 sm:h-7 text-green-600' />
            </div>
            <h3 className='text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900'>
              Verified Certificates
            </h3>
            <p className='text-gray-600 text-sm sm:text-base'>
              Earn recognized certificates to showcase on LinkedIn and boost your resume.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <FeaturedCourses />

      {/* Stats Section */}
      <section className='bg-gray-900 py-12 sm:py-16 md:py-20'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center'>
            <div className='space-y-1 sm:space-y-2'>
              <div className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white'>
                150+
              </div>
              <div className='text-gray-400 text-sm sm:text-base md:text-lg'>Expert Courses</div>
            </div>
            <div className='space-y-1 sm:space-y-2'>
              <div className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white'>
                50K+
              </div>
              <div className='text-gray-400 text-sm sm:text-base md:text-lg'>Active Students</div>
            </div>
            <div className='space-y-1 sm:space-y-2'>
              <div className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white'>
                95%
              </div>
              <div className='text-gray-400 text-sm sm:text-base md:text-lg'>Satisfaction Rate</div>
            </div>
            <div className='space-y-1 sm:space-y-2'>
              <div className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white'>
                24/7
              </div>
              <div className='text-gray-400 text-sm sm:text-base md:text-lg'>Expert Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Why Choose Us */}
      <section className='container mx-auto px-4 py-12 sm:py-16 md:py-20'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center'>
          <div>
            <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6'>
              Why Choose Course Master?
            </h2>
            <p className='text-base sm:text-lg text-gray-600 mb-6 sm:mb-8'>
              We&apos;re not just another online learning platform. We&apos;re committed to
              providing the best learning experience with practical, career-focused courses.
            </p>
            <div className='space-y-3 sm:space-y-5'>
              {[
                { icon: CheckCircle, text: 'Project-based learning with real-world applications' },
                { icon: CheckCircle, text: 'Learn at your own pace with lifetime access' },
                { icon: CheckCircle, text: 'Interactive assignments and quizzes' },
                { icon: CheckCircle, text: 'Career support and job placement assistance' },
                { icon: CheckCircle, text: 'Active community with peer support' },
              ].map((feature, index) => (
                <div key={index} className='flex items-start space-x-3 sm:space-x-4'>
                  <div className='w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5'>
                    <feature.icon className='w-3 h-3 sm:w-4 sm:h-4 text-green-600' />
                  </div>
                  <p className='text-sm sm:text-base md:text-lg text-gray-700'>{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className='relative mt-6 lg:mt-0'>
            <div className='bg-linear-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 text-white'>
              <Globe className='w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mb-4 sm:mb-6 opacity-80' />
              <h3 className='text-xl sm:text-2xl font-bold mb-3 sm:mb-4'>Learn from Anywhere</h3>
              <p className='text-blue-100 text-sm sm:text-base mb-4 sm:mb-6'>
                Join students from 150+ countries learning on Course Master. Our platform is
                available in multiple languages.
              </p>
              <div className='flex flex-wrap gap-1 sm:-space-x-2 sm:flex-nowrap'>
                {['🇺🇸', '🇬🇧', '🇨🇦', '🇦🇺', '🇩🇪', '🇫🇷', '🇯🇵', '🇧🇷'].map((flag, i) => (
                  <span
                    key={i}
                    className='text-lg sm:text-2xl bg-white/10 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center'
                  >
                    {flag}
                  </span>
                ))}
                <span className='text-xs sm:text-sm bg-white/20 rounded-full px-2 sm:px-3 h-8 sm:h-10 flex items-center justify-center ml-1 sm:ml-2'>
                  +142
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <Pricing />

      {/* CTA Section */}
      <section className='container mx-auto px-4 py-12 sm:py-16 md:py-20'>
        <div className='bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 lg:p-16 text-center text-white relative overflow-hidden'>
          <div className='absolute inset-0 opacity-10'>
            <div className='absolute top-0 right-0 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2' />
            <div className='absolute bottom-0 left-0 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-yellow-300 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2' />
          </div>

          <div className='relative z-10'>
            <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6'>
              Ready to Transform Your Career?
            </h2>
            <p className='text-base sm:text-lg md:text-xl text-blue-100 mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto px-2'>
              Join 50,000+ students already learning on Course Master. Start your journey today.
            </p>
            <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center'>
              <Link href='/register'>
                <Button
                  size='lg'
                  className='w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 px-6 sm:px-8 md:px-10 py-5 sm:py-6 text-base sm:text-lg'
                >
                  Get Started for Free
                  <ArrowRight className='ml-2 w-4 h-4 sm:w-5 sm:h-5' />
                </Button>
              </Link>
              <Link href='/course'>
                <Button
                  size='lg'
                  variant='outline'
                  className='w-full sm:w-auto border-white/30 text-blue-600 hover:bg-white/10 px-6 sm:px-8 md:px-10 py-5 sm:py-6 text-base sm:text-lg'
                >
                  Browse Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
