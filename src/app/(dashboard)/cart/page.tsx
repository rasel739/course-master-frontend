'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Tag, ShoppingCart, ArrowRight, Clock, Play, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Rating } from '@/components/ui/rating';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { removeFromCart, selectCartItems, selectCartTotal } from '@/redux/features/cartSlice';
import { formatPrice, formatDuration } from '@/utils';

const CartPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector(selectCartItems);
    const cartTotal = useAppSelector(selectCartTotal);

    const handleRemove = (courseId: string) => {
        dispatch(removeFromCart(courseId));
    };

    if (cartItems.length === 0) {
        return (
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
                <Card>
                    <CardContent className="p-12 text-center">
                        <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-600 mb-6">
                            Looks like you haven&apos;t added any courses yet.
                        </p>
                        <Link href="/courses">
                            <Button>
                                Browse Courses
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const originalTotal = cartItems.reduce((sum, item) => sum + item.course.price * 5, 0);
    const discount = originalTotal - cartTotal;

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
            <p className="text-gray-600 mb-8">{cartItems.length} Course{cartItems.length > 1 ? 's' : ''} in Cart</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map(({ course }) => {
                        const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
                        const totalDuration = course.modules.reduce(
                            (sum, m) => sum + m.lessons.reduce((s, l) => s + l.duration, 0),
                            0
                        );

                        return (
                            <Card key={course._id} className="overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="flex flex-col sm:flex-row">
                                        {/* Thumbnail */}
                                        <div className="relative w-full sm:w-48 h-32 shrink-0 bg-gray-200">
                                            {course.thumbnail ? (
                                                <Image
                                                    src={course.thumbnail}
                                                    alt={course.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600" />
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 p-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1 pr-4">
                                                    <Link href={`/courses/${course._id}`}>
                                                        <h3 className="font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                                                            {course.title}
                                                        </h3>
                                                    </Link>
                                                    <p className="text-sm text-gray-500 mb-2">By {course.instructor}</p>

                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Rating value={4.5} size="sm" showValue />
                                                        <span className="text-xs text-gray-500">(1,234)</span>
                                                    </div>

                                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                                        <span className="flex items-center">
                                                            <Clock className="w-3.5 h-3.5 mr-1" />
                                                            {formatDuration(totalDuration)}
                                                        </span>
                                                        <span className="flex items-center">
                                                            <Play className="w-3.5 h-3.5 mr-1" />
                                                            {totalLessons} lessons
                                                        </span>
                                                        <Badge variant="secondary" className="text-xs">
                                                            {course.category}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                {/* Price & Remove */}
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-purple-600">
                                                        {formatPrice(course.price)}
                                                    </div>
                                                    <div className="text-sm text-gray-500 line-through">
                                                        {formatPrice(course.price * 5)}
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemove(course._id)}
                                                        className="mt-2 text-sm text-purple-600 hover:text-purple-800 flex items-center ml-auto"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Order Summary */}
                <div>
                    <Card className="sticky top-6">
                        <CardContent className="p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Original Price:</span>
                                    <span className="text-gray-500 line-through">{formatPrice(originalTotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Discount:</span>
                                    <span className="text-green-600">-{formatPrice(discount)}</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between">
                                    <span className="font-bold text-gray-900">Total:</span>
                                    <span className="text-2xl font-bold text-purple-600">{formatPrice(cartTotal)}</span>
                                </div>
                            </div>

                            {/* Coupon */}
                            <div className="mb-6">
                                <div className="flex space-x-2">
                                    <Input placeholder="Enter coupon code" className="flex-1" />
                                    <Button variant="outline">
                                        <Tag className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <Button
                                className="w-full py-6 text-lg bg-purple-600 hover:bg-purple-700"
                                onClick={() => router.push('/checkout')}
                            >
                                Checkout
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>

                            <p className="text-center text-xs text-gray-500 mt-4">
                                30-Day Money-Back Guarantee
                            </p>
                        </CardContent>
                    </Card>

                    {/* Promotions */}
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                            <strong>🎉 Special Offer!</strong> Get 80% off on all courses. Limited time only!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
