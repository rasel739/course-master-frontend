import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
    GraduationCap,
    Users,
    BookOpen,
    Award,
    Target,
    Lightbulb,
    Heart,
    ArrowRight,
    CheckCircle,
    Globe,
    Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
    title: 'About Us | Course Master',
    description: 'Learn about Course Master - Your trusted platform for online learning and skill development.',
};

export default function AboutPage() {
    const stats = [
        { label: 'Students', value: '10,000+', icon: Users },
        { label: 'Courses', value: '500+', icon: BookOpen },
        { label: 'Instructors', value: '100+', icon: GraduationCap },
        { label: 'Certificates Issued', value: '25,000+', icon: Award },
    ];

    const values = [
        {
            icon: Target,
            title: 'Quality Education',
            description: 'We provide high-quality, industry-relevant courses designed by experts.',
        },
        {
            icon: Lightbulb,
            title: 'Innovation',
            description: 'We embrace new technologies and teaching methods to enhance learning.',
        },
        {
            icon: Heart,
            title: 'Student Success',
            description: 'Your success is our priority. We support you every step of the way.',
        },
        {
            icon: Globe,
            title: 'Accessibility',
            description: 'Education should be accessible to everyone, anywhere in the world.',
        },
    ];

    const features = [
        'Self-paced learning with lifetime access',
        'Certificate upon course completion',
        'Hands-on projects and assignments',
        'Expert instructor support',
        'Mobile-friendly learning experience',
        'Community forums and discussions',
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            Empowering Learners Worldwide
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100 mb-8">
                            Course Master is your gateway to knowledge and skill development.
                            We believe everyone deserves access to quality education.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/courses">
                                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                                    Explore Courses
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                                    Join for Free
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat) => (
                            <Card key={stat.label} className="text-center">
                                <CardContent className="p-6">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <stat.icon className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                                    <p className="text-gray-600">{stat.label}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Mission</h2>
                            <p className="text-xl text-gray-600">
                                To democratize education by providing accessible, high-quality learning
                                experiences that empower individuals to achieve their goals and transform their lives.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {values.map((value) => (
                                <Card key={value.title} className="hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
                                                <value.icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                                                <p className="text-gray-600">{value.description}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-900 text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Course Master?</h2>
                            <p className="text-xl text-gray-400">
                                We offer a complete learning experience designed for your success.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {features.map((feature) => (
                                <div key={feature} className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center shrink-0">
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                    </div>
                                    <span className="text-lg">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Zap className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Ready to Start Learning?
                        </h2>
                        <p className="text-xl text-gray-600 mb-8">
                            Join thousands of learners who are already transforming their careers with Course Master.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/register">
                                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                    Get Started for Free
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                            <Link href="/courses">
                                <Button size="lg" variant="outline">
                                    Browse Courses
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
