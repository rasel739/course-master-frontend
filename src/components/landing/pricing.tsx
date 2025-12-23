'use client';

import { useState } from 'react';
import { Check, X, Sparkles, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils';

interface PricingPlan {
    id: string;
    name: string;
    description: string;
    price: {
        monthly: number;
        yearly: number;
    };
    icon: React.ElementType;
    features: string[];
    notIncluded?: string[];
    popular?: boolean;
    color: string;
}

const pricingPlans: PricingPlan[] = [
    {
        id: 'free',
        name: 'Free',
        description: 'Perfect for exploring our platform',
        price: { monthly: 0, yearly: 0 },
        icon: Sparkles,
        color: 'gray',
        features: [
            'Access to free courses',
            'Community forum access',
            'Basic progress tracking',
            'Mobile app access',
        ],
        notIncluded: [
            'Premium courses',
            'Certificates',
            'Instructor support',
            'Offline downloads',
        ],
    },
    {
        id: 'pro',
        name: 'Pro',
        description: 'Best for individual learners',
        price: { monthly: 29, yearly: 19 },
        icon: Zap,
        color: 'blue',
        popular: true,
        features: [
            'All free features',
            'Access to all courses',
            'Course certificates',
            'Priority support',
            'Offline downloads',
            'Personalized learning path',
        ],
        notIncluded: ['Team management', 'Custom learning tracks'],
    },
    {
        id: 'teams',
        name: 'Teams',
        description: 'For organizations and teams',
        price: { monthly: 49, yearly: 39 },
        icon: Crown,
        color: 'purple',
        features: [
            'All Pro features',
            'Team management dashboard',
            'Custom learning tracks',
            'Admin analytics',
            'SSO integration',
            'Dedicated account manager',
            'API access',
            'Volume discounts',
        ],
    },
];

export const Pricing = () => {
    const [isYearly, setIsYearly] = useState(true);

    return (
        <section className="py-12 sm:py-16 md:py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8 sm:mb-10 md:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
                        Choose the plan that fits your learning goals. Upgrade or downgrade at any time.
                    </p>

                    {/* Billing Toggle */}
                    <div className="inline-flex items-center bg-gray-100 rounded-full p-0.5 sm:p-1">
                        <button
                            onClick={() => setIsYearly(false)}
                            className={cn(
                                'px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all',
                                !isYearly ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
                            )}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setIsYearly(true)}
                            className={cn(
                                'px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center space-x-1 sm:space-x-2',
                                isYearly ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
                            )}
                        >
                            <span>Yearly</span>
                            <Badge variant="success" className="text-[10px] sm:text-xs">Save 35%</Badge>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
                    {pricingPlans.map((plan) => {
                        const Icon = plan.icon;
                        const price = isYearly ? plan.price.yearly : plan.price.monthly;

                        return (
                            <Card
                                key={plan.id}
                                className={cn(
                                    'relative overflow-hidden transition-all duration-300',
                                    plan.popular
                                        ? 'border-blue-500 border-2 shadow-xl md:scale-[1.02]'
                                        : 'hover:shadow-lg hover:-translate-y-1'
                                )}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 right-0">
                                        <div className="bg-blue-600 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-4 py-0.5 sm:py-1 rounded-bl-lg">
                                            Most Popular
                                        </div>
                                    </div>
                                )}

                                <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
                                    <div
                                        className={cn(
                                            'w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4',
                                            plan.color === 'gray' && 'bg-gray-100',
                                            plan.color === 'blue' && 'bg-blue-100',
                                            plan.color === 'purple' && 'bg-purple-100'
                                        )}
                                    >
                                        <Icon
                                            className={cn(
                                                'w-5 h-5 sm:w-6 sm:h-6',
                                                plan.color === 'gray' && 'text-gray-600',
                                                plan.color === 'blue' && 'text-blue-600',
                                                plan.color === 'purple' && 'text-purple-600'
                                            )}
                                        />
                                    </div>
                                    <CardTitle className="text-lg sm:text-xl">{plan.name}</CardTitle>
                                    <CardDescription className="text-xs sm:text-sm">{plan.description}</CardDescription>
                                </CardHeader>

                                <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                                    <div className="mb-4 sm:mb-6">
                                        <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                                            ${price}
                                        </span>
                                        <span className="text-gray-500 text-xs sm:text-sm">
                                            {price > 0 ? (isYearly ? '/mo, billed yearly' : '/month') : ' forever'}
                                        </span>
                                    </div>

                                    <Button
                                        className={cn(
                                            'w-full mb-4 sm:mb-6 text-sm sm:text-base py-2 sm:py-2.5',
                                            plan.popular
                                                ? 'bg-blue-600 hover:bg-blue-700'
                                                : plan.id === 'teams'
                                                    ? 'bg-purple-600 hover:bg-purple-700'
                                                    : ''
                                        )}
                                        variant={plan.id === 'free' ? 'outline' : 'default'}
                                    >
                                        {plan.id === 'free' ? 'Get Started Free' : 'Start 7-Day Free Trial'}
                                    </Button>

                                    <div className="space-y-2 sm:space-y-3">
                                        {plan.features.map((feature, index) => (
                                            <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                                                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 shrink-0 mt-0.5" />
                                                <span className="text-xs sm:text-sm text-gray-700">{feature}</span>
                                            </div>
                                        ))}
                                        {plan.notIncluded?.map((feature, index) => (
                                            <div key={index} className="flex items-start space-x-2 sm:space-x-3 opacity-50">
                                                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 shrink-0 mt-0.5" />
                                                <span className="text-xs sm:text-sm text-gray-500">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Money Back Guarantee */}
                <div className="text-center mt-8 sm:mt-10 md:mt-12">
                    <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-4 sm:px-6 py-2 sm:py-3 rounded-full">
                        <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="font-medium text-xs sm:text-sm md:text-base">30-day money-back guarantee</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
