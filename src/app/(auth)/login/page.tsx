'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { GraduationCap, Loader2 } from 'lucide-react';
import { ILogin } from '@/types';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { clearError, loginUser } from '@/redux/features/authSlice';
import { loginSchema } from '@/schema';

const LoginContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { isLoading, isAuthenticated, error, user } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>({
    resolver: yupResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        const callbackUrl = searchParams.get('callbackUrl') || '/student';
        router.push(callbackUrl);
      }
    }
  }, [isAuthenticated, user, router, searchParams]);
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit: SubmitHandler<ILogin> = async (data) => {
    await dispatch(loginUser(data));
  };

  return (
    <div className='min-h-screen bg-linear-to-br from-blue-600 via-blue-700 to-purple-700 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1 text-center px-4 sm:px-6 pt-4 sm:pt-6'>
          <Link href='/' className='inline-flex items-center justify-center space-x-2 mb-2 sm:mb-4'>
            <div className='w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'>
              <GraduationCap className='w-5 h-5 sm:w-6 sm:h-6 text-white' />
            </div>
            <span className='text-xl sm:text-2xl font-bold'>Course Master</span>
          </Link>
          <CardTitle className='text-xl sm:text-2xl'>Welcome back</CardTitle>
          <CardDescription className='text-sm'>
            Sign in to your account to continue learning
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className='space-y-3 sm:space-y-4 px-4 sm:px-6'>
            {error && (
              <div className='bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm'>
                {error}
              </div>
            )}

            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='john@example.com'
                {...register('email')}
              />
              {errors.email && <p className='text-sm text-red-600'>{errors.email.message}</p>}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='••••••••'
                {...register('password')}
              />
              {errors.password && <p className='text-sm text-red-600'>{errors.password.message}</p>}
            </div>
          </CardContent>
          <CardFooter className='flex flex-col space-y-3 sm:space-y-4 px-4 sm:px-6 pb-4 sm:pb-6'>
            <Button
              type='submit'
              className='w-full text-sm sm:text-base py-2 sm:py-2.5'
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            <p className='text-xs sm:text-sm text-center text-gray-600'>
              Don&apos;t have an account?{' '}
              <Link href='/register' className='text-blue-600 hover:underline font-medium'>
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

const LoginFallback = () => (
  <div className='min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4'>
    <Card className='w-full max-w-md'>
      <CardContent className='p-8 flex items-center justify-center'>
        <Loader2 className='w-8 h-8 animate-spin text-blue-600' />
      </CardContent>
    </Card>
  </div>
);

const Login = () => {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  );
};

export default Login;
