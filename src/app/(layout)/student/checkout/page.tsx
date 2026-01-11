'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Lock, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { selectCartItems, selectCartTotal, clearCart } from '@/redux/features/cartSlice';
import { createPaymentIntent, clearPaymentState } from '@/redux/features/paymentSlice';
import { enrollInCourse } from '@/redux/features/enrollmentSlice';
import { formatPrice } from '@/utils';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const CheckoutForm = ({
    onSuccess,
    isProcessing,
    setIsProcessing
}: {
    onSuccess: () => void;
    isProcessing: boolean;
    setIsProcessing: (value: boolean) => void;
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setErrorMessage(null);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/checkout/success`,
            },
            redirect: 'if_required',
        });

        if (error) {
            setErrorMessage(error.message || 'An error occurred during payment');
            setIsProcessing(false);
        } else {
            toast.success('Payment successful!');
            onSuccess();
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-4">
                <PaymentElement
                    options={{
                        layout: 'tabs',
                    }}
                />

                {errorMessage && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{errorMessage}</span>
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full py-6 text-lg bg-purple-600 hover:bg-purple-700"
                    disabled={!stripe || !elements || isProcessing}
                >
                    {isProcessing ? (
                        <>Processing...</>
                    ) : (
                        <>
                            <Lock className="w-4 h-4 mr-2" />
                            Complete Purchase
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
};

const CheckoutPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector(selectCartItems);
    const cartTotal = useAppSelector(selectCartTotal);
    const { clientSecret, isLoading: paymentLoading, error: paymentError } = useAppSelector(
        (state) => state.payment
    );

    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (cartItems.length > 0 && !clientSecret) {
            const courseIds = cartItems.map(item => item.course._id);
            dispatch(createPaymentIntent(courseIds));
        }
    }, [cartItems, clientSecret, dispatch]);

    useEffect(() => {
        return () => {
            dispatch(clearPaymentState());
        };
    }, [dispatch]);

    const handlePaymentSuccess = async () => {
        try {
            for (const item of cartItems) {
                await dispatch(enrollInCourse(item.course._id)).unwrap();
            }

            dispatch(clearCart());
            dispatch(clearPaymentState());
            router.push('/checkout/success');
        } catch (error) {
            console.error('Enrollment failed:', error);
            toast.error('Payment succeeded but enrollment failed. Please contact support.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (cartItems.length === 0) {
        router.push('/cart');
        return null;
    }

    const stripeOptions = {
        clientSecret: clientSecret || undefined,
        appearance: {
            theme: 'stripe' as const,
            variables: {
                colorPrimary: '#7c3aed',
                colorBackground: '#ffffff',
                colorText: '#1f2937',
                borderRadius: '8px',
            },
        },
    };

    return (
        <div className="max-w-6xl mx-auto">
            <Button
                variant="ghost"
                onClick={() => router.push('/cart')}
                className="mb-6"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to cart
            </Button>

            <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Payment Form */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                Payment Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {paymentLoading && !clientSecret && (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                                    <span className="ml-3 text-gray-600">Preparing payment...</span>
                                </div>
                            )}

                            {paymentError && (
                                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                                    <AlertCircle className="w-5 h-5" />
                                    <span>{paymentError}</span>
                                </div>
                            )}

                            {clientSecret && (
                                <Elements stripe={stripePromise} options={stripeOptions}>
                                    <CheckoutForm
                                        onSuccess={handlePaymentSuccess}
                                        isProcessing={isProcessing}
                                        setIsProcessing={setIsProcessing}
                                    />
                                </Elements>
                            )}

                            {!clientSecret && !paymentLoading && !paymentError && (
                                <div className="text-center py-8 text-gray-500">
                                    <p>Unable to initialize payment. Please try again.</p>
                                    <Button
                                        variant="outline"
                                        className="mt-4"
                                        onClick={() => {
                                            const courseIds = cartItems.map(item => item.course._id);
                                            dispatch(createPaymentIntent(courseIds));
                                        }}
                                    >
                                        Retry
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Security Badge */}
                    <div className="flex items-center justify-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <ShieldCheck className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-gray-600">
                            Your payment is protected by Stripe's secure encryption
                        </span>
                    </div>
                </div>

                {/* Order Summary */}
                <div>
                    <Card className="sticky top-6">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 mb-6">
                                {cartItems.map(({ course }) => (
                                    <div key={course._id} className="flex gap-3">
                                        <div className="relative w-16 h-12 shrink-0 rounded overflow-hidden bg-gray-200">
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
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                                {course.title}
                                            </p>
                                            <p className="text-sm text-purple-600 font-bold">
                                                {formatPrice(course.price)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-2 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span>{formatPrice(cartTotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax:</span>
                                    <span>$0.00</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                    <span>Total:</span>
                                    <span className="text-purple-600">{formatPrice(cartTotal)}</span>
                                </div>
                            </div>

                            <div className="text-center text-xs text-gray-500">
                                <p>By completing your purchase, you agree to our Terms of Service and Privacy Policy.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
