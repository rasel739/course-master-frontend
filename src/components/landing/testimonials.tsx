'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Rating } from '@/components/ui/rating';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  content: string;
  course: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Frontend Developer',
    company: 'Google',
    avatar: '',
    rating: 5,
    content:
      "This course completely transformed my career. The practical projects and real-world examples helped me land my dream job at Google. I can't recommend it enough!",
    course: 'Complete Web Development Bootcamp',
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Data Scientist',
    company: 'Amazon',
    avatar: '',
    rating: 5,
    content:
      'The Machine Learning course is exceptional. The instructor explains complex concepts in a way that is easy to understand. I went from knowing nothing to building AI models.',
    course: 'Machine Learning A-Z',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'Full Stack Developer',
    company: 'Netflix',
    avatar: '',
    rating: 5,
    content:
      "Best investment I've ever made in my career. The community support and updated content kept me engaged throughout. Now I'm confidently building production apps.",
    course: 'React - The Complete Guide',
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'Cloud Architect',
    company: 'Microsoft',
    avatar: '',
    rating: 5,
    content:
      'Passed my AWS certification on the first attempt thanks to this course! The hands-on labs and practice exams are exactly what you need to succeed.',
    course: 'AWS Certified Solutions Architect',
  },
  {
    id: '5',
    name: 'Jessica Brown',
    role: 'Mobile Developer',
    company: 'Spotify',
    avatar: '',
    rating: 5,
    content:
      "I've taken many online courses, but this one stands out. The instructor's teaching style and the depth of content are unmatched. Highly recommended!",
    course: 'Flutter & Dart - The Complete Guide',
  },
];

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Get visible testimonials based on current index
  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(testimonials[(currentIndex + i) % testimonials.length]);
    }
    return visible;
  };

  const visibleTestimonials = getVisibleTestimonials();

  return (
    <section className='py-12 sm:py-16 md:py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-8 sm:mb-10 md:mb-12'>
          <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4'>
            What Our Students Say
          </h2>
          <p className='text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2'>
            Join thousands of satisfied learners who have transformed their careers with our courses
          </p>
        </div>

        <div className='relative'>
          {/* Testimonial Cards Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
            {visibleTestimonials.map((testimonial, index) => (
              <Card
                key={`${testimonial.id}-${index}`}
                className={`relative overflow-hidden hover-lift transition-all duration-300 bg-white/80 backdrop-blur-sm ${index === 0 ? '' : index === 1 ? 'hidden md:block' : 'hidden lg:block'
                  }`}
              >
                <CardContent className='p-4 sm:p-5 md:p-6'>
                  <Quote className='w-8 h-8 sm:w-10 sm:h-10 text-blue-100 absolute top-3 right-3 sm:top-4 sm:right-4' />

                  <Rating value={testimonial.rating} size='sm' className='mb-3 sm:mb-4' />

                  <p className='text-gray-700 text-sm sm:text-base mb-4 sm:mb-6 relative z-10 line-clamp-4'>
                    {testimonial.content}
                  </p>

                  <div className='flex items-center space-x-3'>
                    <Avatar
                      size='md'
                      fallback={testimonial.name}
                      className='ring-2 ring-blue-100 w-10 h-10 sm:w-12 sm:h-12'
                    />
                    <div className='min-w-0'>
                      <p className='font-semibold text-gray-900 text-sm sm:text-base truncate'>{testimonial.name}</p>
                      <p className='text-xs sm:text-sm text-gray-500 truncate'>
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>

                  <div className='mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100'>
                    <p className='text-xs text-gray-500'>
                      Course:{' '}
                      <span className='font-medium text-blue-600'>{testimonial.course}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation */}
          <div className='flex items-center justify-center space-x-3 sm:space-x-4 mt-6 sm:mt-8'>
            <Button
              variant='outline'
              size='icon'
              onClick={prevTestimonial}
              className='rounded-full w-9 h-9 sm:w-10 sm:h-10'
            >
              <ChevronLeft className='w-4 h-4 sm:w-5 sm:h-5' />
            </Button>

            <div className='flex items-center space-x-1.5 sm:space-x-2'>
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 sm:h-2.5 rounded-full transition-all ${index === currentIndex ? 'bg-blue-600 w-5 sm:w-6' : 'bg-gray-300 hover:bg-gray-400 w-2 sm:w-2.5'
                    }`}
                />
              ))}
            </div>

            <Button
              variant='outline'
              size='icon'
              onClick={nextTestimonial}
              className='rounded-full w-9 h-9 sm:w-10 sm:h-10'
            >
              <ChevronRight className='w-4 h-4 sm:w-5 sm:h-5' />
            </Button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className='mt-10 sm:mt-12 md:mt-16 text-center'>
          <p className='text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6'>Trusted by learners from top companies</p>
          <div className='flex items-center justify-start sm:justify-center space-x-4 sm:space-x-6 md:space-x-8 lg:space-x-12 overflow-x-auto pb-2 px-4 -mx-4'>
            {['Google', 'Amazon', 'Microsoft', 'Netflix', 'Spotify', 'Meta'].map((company) => (
              <span
                key={company}
                className='text-base sm:text-lg md:text-xl font-bold text-gray-400 whitespace-nowrap opacity-60 grayscale'
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
