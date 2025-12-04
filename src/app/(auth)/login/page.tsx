'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Loader2 } from 'lucide-react';
import { ILogin } from '@/types';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { clearError, loginUser } from '@/redux/features/authSlice';
import { loginSchema } from '@/schema';

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { isLoading, isAuthenticated, error } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>({
    resolver: yupResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
      router.push(callbackUrl);
    }
  }, [isAuthenticated, router, searchParams]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit: SubmitHandler<ILogin> = async (data) => {
    await dispatch(loginUser(data));
  };

  return (
    <div className='min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-4'>
          <div className='flex justify-center'>
            <div className='w-12 h-12 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'>
              <GraduationCap className='w-7 h-7 text-white' />
            </div>
          </div>
          <div className='space-y-2 text-center'>
            <CardTitle className='text-2xl'>Welcome Back</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
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

            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            <div className='text-center text-sm'>
              <span className='text-gray-600'>{"Don't have an account? "}</span>
              <Link href='/register' className='text-blue-600 hover:text-blue-700 font-medium'>
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
