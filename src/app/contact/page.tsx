import { Metadata } from 'next';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  HelpCircle,
  Users,
  Briefcase,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Contact Us | Course Master',
  description:
    "Get in touch with Course Master. We're here to help with any questions or concerns.",
};

const ContactPage = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Send us an email anytime',
      value: 'support@coursemaster.com',
      link: 'mailto:support@coursemaster.com',
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Mon-Fri from 8am to 6pm',
      value: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      description: 'Come say hello',
      value: '123 Learning Street, Education City, EC 12345',
      link: 'https://maps.google.com',
    },
    {
      icon: Clock,
      title: 'Working Hours',
      description: 'Our support team is available',
      value: 'Mon-Fri: 8am - 6pm EST',
      link: null,
    },
  ];

  const categories = [
    {
      icon: MessageSquare,
      title: 'General Inquiry',
      description: 'Questions about our platform',
    },
    {
      icon: HelpCircle,
      title: 'Technical Support',
      description: 'Help with technical issues',
    },
    {
      icon: Users,
      title: 'Student Support',
      description: 'Course and learning assistance',
    },
    {
      icon: Briefcase,
      title: 'Business Partnership',
      description: 'Collaborate with us',
    },
  ];

  const faqs = [
    {
      question: 'How quickly will I receive a response?',
      answer: 'We typically respond to all inquiries within 24 hours during business days.',
    },
    {
      question: 'Can I schedule a demo?',
      answer: 'Yes! Contact our sales team to schedule a personalized demo of our platform.',
    },
    {
      question: 'Do you offer corporate training?',
      answer: 'Absolutely! We provide customized training solutions for businesses of all sizes.',
    },
  ];

  return (
    <>
      <Header />
      <div className='min-h-screen bg-gray-50'>
        {/* Hero Section */}
        <section className='bg-linear-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-20'>
          <div className='container mx-auto px-4'>
            <div className='max-w-3xl mx-auto text-center'>
              <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold mb-6'>Get in Touch</h1>
              <p className='text-xl md:text-2xl text-blue-100 mb-8'>
                {
                  "We're here to help and answer any questions you may have. Reach out to us and we'll respond as soon as we can."
                }
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information Cards */}
        <section className='container mx-auto px-4 py-16 -mt-12 relative z-10'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {contactInfo.map((info) => (
              <Card key={info.title} className='hover:shadow-lg transition-shadow'>
                <CardContent className='p-6'>
                  <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4'>
                    <info.icon className='w-6 h-6 text-blue-600' />
                  </div>
                  <h3 className='font-semibold text-gray-900 mb-2'>{info.title}</h3>
                  <p className='text-sm text-gray-600 mb-3'>{info.description}</p>
                  {info.link ? (
                    <a
                      href={info.link}
                      className='text-blue-600 hover:text-blue-700 font-medium text-sm break-all'
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className='text-gray-900 font-medium text-sm'>{info.value}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Main Contact Section */}
        <section className='container mx-auto px-4 py-12'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Contact Form */}
            <div className='lg:col-span-2'>
              <Card>
                <CardContent className='p-8'>
                  <h2 className='text-2xl font-bold text-gray-900 mb-6'>Send us a Message</h2>

                  <form className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div>
                        <Label htmlFor='firstName'>
                          First Name <span className='text-red-500'>*</span>
                        </Label>
                        <Input
                          id='firstName'
                          type='text'
                          placeholder='John'
                          required
                          className='mt-2'
                        />
                      </div>
                      <div>
                        <Label htmlFor='lastName'>
                          Last Name <span className='text-red-500'>*</span>
                        </Label>
                        <Input
                          id='lastName'
                          type='text'
                          placeholder='Doe'
                          required
                          className='mt-2'
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor='email'>
                        Email Address <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        id='email'
                        type='email'
                        placeholder='john@example.com'
                        required
                        className='mt-2'
                      />
                    </div>

                    <div>
                      <Label htmlFor='phone'>Phone Number</Label>
                      <Input
                        id='phone'
                        type='tel'
                        placeholder='+1 (555) 123-4567'
                        className='mt-2'
                      />
                    </div>

                    <div>
                      <Label htmlFor='category'>
                        Category <span className='text-red-500'>*</span>
                      </Label>
                      <select
                        id='category'
                        required
                        className='mt-2 flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2'
                      >
                        <option value=''>Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat.title} value={cat.title}>
                            {cat.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor='subject'>
                        Subject <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        id='subject'
                        type='text'
                        placeholder='How can we help?'
                        required
                        className='mt-2'
                      />
                    </div>

                    <div>
                      <Label htmlFor='message'>
                        Message <span className='text-red-500'>*</span>
                      </Label>
                      <Textarea
                        id='message'
                        rows={6}
                        placeholder='Tell us more about your inquiry...'
                        required
                        className='mt-2'
                      />
                    </div>

                    <div className='flex items-start space-x-2'>
                      <input
                        type='checkbox'
                        id='privacy'
                        required
                        className='w-4 h-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                      />
                      <label htmlFor='privacy' className='text-sm text-gray-600'>
                        I agree to the{' '}
                        <a href='/privacy' className='text-blue-600 hover:underline'>
                          Privacy Policy
                        </a>{' '}
                        and{' '}
                        <a href='/terms' className='text-blue-600 hover:underline'>
                          Terms of Service
                        </a>
                      </label>
                    </div>

                    <Button type='submit' size='lg' className='w-full'>
                      <Send className='w-4 h-4 mr-2' />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className='space-y-6'>
              {/* Categories */}
              <Card>
                <CardContent className='p-6'>
                  <h3 className='font-semibold text-gray-900 mb-4'>Contact Categories</h3>
                  <div className='space-y-4'>
                    {categories.map((category) => (
                      <div key={category.title} className='flex items-start space-x-3'>
                        <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0'>
                          <category.icon className='w-5 h-5 text-blue-600' />
                        </div>
                        <div>
                          <h4 className='font-medium text-gray-900 text-sm'>{category.title}</h4>
                          <p className='text-xs text-gray-600'>{category.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* FAQs */}
              <Card>
                <CardContent className='p-6'>
                  <h3 className='font-semibold text-gray-900 mb-4'>Quick FAQs</h3>
                  <div className='space-y-4'>
                    {faqs.map((faq, index) => (
                      <div key={index}>
                        <h4 className='font-medium text-gray-900 text-sm mb-2'>{faq.question}</h4>
                        <p className='text-xs text-gray-600'>{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                  <Button variant='outline' className='w-full mt-4'>
                    <HelpCircle className='w-4 h-4 mr-2' />
                    View All FAQs
                  </Button>
                </CardContent>
              </Card>

              {/* Support Hours */}
              <Card className='bg-linear-to-br from-blue-600 to-purple-600 text-white'>
                <CardContent className='p-6'>
                  <Clock className='w-10 h-10 mb-4 opacity-80' />
                  <h3 className='font-semibold mb-2'>24/7 Support Available</h3>
                  <p className='text-blue-100 text-sm mb-4'>
                    Our support team is available around the clock to assist you with any questions
                    or concerns.
                  </p>
                  <Button
                    variant='outline'
                    className='w-full border-white text-white hover:bg-white/10'
                  >
                    Start Live Chat
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Map Section (Optional) */}
        <section className='container mx-auto px-4 py-12'>
          <Card>
            <CardContent className='p-0 overflow-hidden'>
              <div className='aspect-video bg-gray-200 flex items-center justify-center'>
                <div className='text-center'>
                  <MapPin className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                  <p className='text-gray-600'>Interactive map would be embedded here</p>
                  <p className='text-sm text-gray-500 mt-2'>
                    123 Learning Street, Education City, EC 12345
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Additional Resources */}
        <section className='bg-gray-100 py-16'>
          <div className='container mx-auto px-4'>
            <div className='max-w-3xl mx-auto text-center'>
              <h2 className='text-3xl font-bold text-gray-900 mb-4'>Looking for Something Else?</h2>
              <p className='text-gray-600 mb-8'>
                Explore our resources or connect with us on social media
              </p>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <Card className='hover:shadow-md transition-shadow cursor-pointer'>
                  <CardContent className='p-6 text-center'>
                    <HelpCircle className='w-8 h-8 text-blue-600 mx-auto mb-3' />
                    <h3 className='font-semibold text-gray-900 mb-2'>Help Center</h3>
                    <p className='text-sm text-gray-600'>Find answers to common questions</p>
                  </CardContent>
                </Card>
                <Card className='hover:shadow-md transition-shadow cursor-pointer'>
                  <CardContent className='p-6 text-center'>
                    <MessageSquare className='w-8 h-8 text-blue-600 mx-auto mb-3' />
                    <h3 className='font-semibold text-gray-900 mb-2'>Community Forum</h3>
                    <p className='text-sm text-gray-600'>Join discussions with other learners</p>
                  </CardContent>
                </Card>
                <Card className='hover:shadow-md transition-shadow cursor-pointer'>
                  <CardContent className='p-6 text-center'>
                    <Users className='w-8 h-8 text-blue-600 mx-auto mb-3' />
                    <h3 className='font-semibold text-gray-900 mb-2'>Social Media</h3>
                    <p className='text-sm text-gray-600'>Follow us for updates and tips</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;
