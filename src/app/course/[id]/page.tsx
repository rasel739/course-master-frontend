'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Clock,
  Play,
  ChevronRight,
  Loader2,
  CheckCircle,
  Globe,
  Smartphone,
  Trophy,
  FileText,
  MonitorPlay,
  Infinity,
  Heart,
  Share2,
  Gift,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rating } from '@/components/ui/rating';
import { Curriculum } from '@/components/courses/curriculum';
import { InstructorCard } from '@/components/courses/instructor-card';
import { ReviewsSection } from '@/components/courses/reviews-section';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { fetchCourseById } from '@/redux/features/courseSlice';
import { enrollInCourse } from '@/redux/features/enrollmentSlice';
import { formatDate, formatDuration, formatPrice } from '@/utils';
import Loading from '@/app/loading';
import Header from '@/components/layout/header';

const CourseDetails = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedCourse: course, isLoading } = useAppSelector((state) => state.course);
  const { user } = useAppSelector((state) => state.auth);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchCourseById(params.id as string));
    }
  }, [dispatch, params.id]);

  const handleEnroll = async () => {
    if (!course) return;

    setEnrolling(true);
    try {
      await dispatch(enrollInCourse(course._id)).unwrap();
      router.push('/student');
    } catch {
    } finally {
      setEnrolling(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!course) {
    return (
      <Card>
        <CardContent className='p-12 text-center'>
          <p className='text-gray-600'>Course not found</p>
        </CardContent>
      </Card>
    );
  }

  const isEnrolled = user?.enrolledCourses.includes(course._id);
  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const totalDuration = course.modules.reduce(
    (sum, m) => sum + m.lessons.reduce((s, l) => s + l.duration, 0),
    0
  );

  const rating = course.averageRating || 4.5;
  const reviewCount = course.totalReviews || 0;
  const lastUpdated = new Date(course.updatedAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <Header />
      <div className='min-h-screen bg-gray-50'>
        {/* Course Header - Dark Theme like Udemy */}
        <div className='bg-gray-900 text-white'>
          <div className='container mx-auto px-4 py-8'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
              {/* Left Content */}
              <div className='lg:col-span-2'>
                {/* Breadcrumb */}
                <div className='flex items-center space-x-2 text-sm text-gray-400 mb-4'>
                  <span className='hover:text-white cursor-pointer'>Development</span>
                  <ChevronRight className='w-4 h-4' />
                  <span className='hover:text-white cursor-pointer'>{course.category}</span>
                </div>

                <h1 className='text-3xl md:text-4xl font-bold mb-4'>{course.title}</h1>
                <p className='text-lg text-gray-300 mb-4'>{course.description}</p>

                {/* Rating & Meta */}
                <div className='flex flex-wrap items-center gap-4 mb-4'>
                  <Badge className='bg-yellow-500 text-black font-bold'>Bestseller</Badge>
                  <div className='flex items-center space-x-1'>
                    <span className='font-bold text-yellow-400'>{rating}</span>
                    <Rating value={rating} size='sm' />
                    <span className='text-blue-400 hover:underline cursor-pointer'>
                      ({reviewCount.toLocaleString()} ratings)
                    </span>
                  </div>
                  <span className='text-gray-300'>
                    {course.totalEnrollments.toLocaleString()} students
                  </span>
                </div>

                {/* Instructor & Update */}
                <div className='flex flex-wrap items-center gap-4 text-sm'>
                  <span>
                    Created by{' '}
                    <span className='text-blue-400 hover:underline cursor-pointer'>
                      {course.instructor}
                    </span>
                  </span>
                  <span className='flex items-center gap-1'>
                    <Clock className='w-4 h-4' /> Last updated {lastUpdated}
                  </span>
                  <span className='flex items-center gap-1'>
                    <Globe className='w-4 h-4' /> English
                  </span>
                </div>
              </div>

              <div className='hidden lg:block' />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='container mx-auto px-4 py-8'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Left Content */}
            <div className='lg:col-span-2 space-y-8'>
              {/* What You'll Learn */}
              <Card>
                <CardContent className='p-6'>
                  <h2 className='text-xl font-bold text-gray-900 mb-4'>What you&apos;ll learn</h2>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    {course.tags.map((tag, index) => (
                      <div key={index} className='flex items-start space-x-3'>
                        <CheckCircle className='w-5 h-5 text-gray-700 shrink-0 mt-0.5' />
                        <span className='text-gray-700'>{tag}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Course Content */}
              <Curriculum modules={course.modules} isEnrolled={isEnrolled} />

              {/* Requirements */}
              <Card>
                <CardContent className='p-6'>
                  <h2 className='text-xl font-bold text-gray-900 mb-4'>Requirements</h2>
                  <ul className='space-y-2'>
                    <li className='flex items-start space-x-2'>
                      <span className='text-gray-400'>•</span>
                      <span className='text-gray-700'>
                        No programming experience needed - I&apos;ll teach you everything
                      </span>
                    </li>
                    <li className='flex items-start space-x-2'>
                      <span className='text-gray-400'>•</span>
                      <span className='text-gray-700'>A computer with access to the internet</span>
                    </li>
                    <li className='flex items-start space-x-2'>
                      <span className='text-gray-400'>•</span>
                      <span className='text-gray-700'>Dedication and willingness to learn</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardContent className='p-6'>
                  <h2 className='text-xl font-bold text-gray-900 mb-4'>Description</h2>
                  <div className='prose prose-gray max-w-none'>
                    <p className='text-gray-700 mb-4'>{course.description}</p>
                    <p className='text-gray-700'>
                      This comprehensive course will take you from a complete beginner to a
                      confident developer. You&apos;ll learn through hands-on projects and
                      real-world examples that you can add to your portfolio.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Instructor */}
              <InstructorCard
                name={course.instructor}
                title='Expert Instructor & Developer'
                bio='A passionate developer with over 10 years of experience in web development. Has taught thousands of students worldwide and worked with top companies. Known for making complex topics easy to understand.'
                rating={4.8}
                reviewCount={25000}
                studentCount={150000}
                courseCount={12}
              />

              {/* Reviews */}
              <ReviewsSection />
            </div>

            {/* Right Sidebar - Sticky Card */}
            <div className='lg:block'>
              <div className='lg:sticky lg:top-6 space-y-4'>
                <Card className='overflow-hidden shadow-xl'>
                  {/* Course Preview Image */}
                  <div className='relative h-48 bg-gray-200'>
                    {course.thumbnail ? (
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className='object-cover'
                      />
                    ) : (
                      <div className='absolute inset-0 bg-linear-to-br from-blue-500 to-purple-600' />
                    )}
                    <div className='absolute inset-0 bg-black/40 flex items-center justify-center'>
                      <div className='w-16 h-16 bg-white rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform'>
                        <Play className='w-8 h-8 text-gray-900 ml-1' fill='currentColor' />
                      </div>
                    </div>
                    <span className='absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-sm font-medium'>
                      Preview this course
                    </span>
                  </div>

                  <CardContent className='p-6 space-y-4'>
                    {/* Price */}
                    <div className='flex items-center space-x-3'>
                      <span className='text-3xl font-bold text-gray-900'>
                        {formatPrice(course.price)}
                      </span>
                      <span className='text-lg text-gray-500 line-through'>
                        {formatPrice(course.price * 5)}
                      </span>
                      <Badge variant='destructive'>80% off</Badge>
                    </div>

                    <p className='text-red-600 font-medium text-sm'>
                      <Clock className='w-4 h-4 inline mr-1' />2 days left at this price!
                    </p>

                    {/* CTA Buttons */}
                    {isEnrolled ? (
                      <Button
                        className='w-full py-6 text-lg'
                        onClick={() => router.push('/student')}
                      >
                        Go to Dashboard
                      </Button>
                    ) : (
                      <>
                        <Button className='w-full py-6 text-lg bg-purple-600 hover:bg-purple-700'>
                          Add to cart
                        </Button>
                        <Button
                          className='w-full py-6 text-lg'
                          variant='outline'
                          onClick={handleEnroll}
                          disabled={enrolling}
                        >
                          {enrolling ? (
                            <>
                              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                              Enrolling...
                            </>
                          ) : (
                            'Buy now'
                          )}
                        </Button>
                      </>
                    )}

                    <p className='text-center text-sm text-gray-500'>30-Day Money-Back Guarantee</p>

                    {/* Share & Wishlist */}
                    <div className='flex items-center justify-center space-x-4 pt-2'>
                      <button className='flex items-center space-x-1 text-gray-600 hover:text-gray-900'>
                        <Share2 className='w-4 h-4' />
                        <span className='text-sm'>Share</span>
                      </button>
                      <button className='flex items-center space-x-1 text-gray-600 hover:text-gray-900'>
                        <Gift className='w-4 h-4' />
                        <span className='text-sm'>Gift</span>
                      </button>
                      <button className='flex items-center space-x-1 text-gray-600 hover:text-gray-900'>
                        <Heart className='w-4 h-4' />
                        <span className='text-sm'>Wishlist</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>

                {/* Course Includes */}
                <Card>
                  <CardContent className='p-6'>
                    <h3 className='font-bold text-gray-900 mb-4'>This course includes:</h3>
                    <ul className='space-y-3 text-sm'>
                      <li className='flex items-center space-x-3'>
                        <MonitorPlay className='w-5 h-5 text-gray-500' />
                        <span>{formatDuration(totalDuration)} on-demand video</span>
                      </li>
                      <li className='flex items-center space-x-3'>
                        <FileText className='w-5 h-5 text-gray-500' />
                        <span>{totalLessons} downloadable resources</span>
                      </li>
                      <li className='flex items-center space-x-3'>
                        <Smartphone className='w-5 h-5 text-gray-500' />
                        <span>Access on mobile and TV</span>
                      </li>
                      <li className='flex items-center space-x-3'>
                        <Infinity className='w-5 h-5 text-gray-500' />
                        <span>Full lifetime access</span>
                      </li>
                      <li className='flex items-center space-x-3'>
                        <Trophy className='w-5 h-5 text-gray-500' />
                        <span>Certificate of completion</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Batch Info */}
                <Card>
                  <CardContent className='p-6'>
                    <h3 className='font-bold text-gray-900 mb-4'>Batch Information</h3>
                    <div className='space-y-2 text-sm'>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>Batch Number</span>
                        <span className='font-medium'>Batch {course.batch.number}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>Start Date</span>
                        <span className='font-medium'>{formatDate(course.batch.startDate)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetails;
