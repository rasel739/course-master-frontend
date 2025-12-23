'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Loader2 } from 'lucide-react';
import { IRegister } from '@/types';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { clearError, registerUser } from '@/redux/features/authSlice';
import { registerSchema } from '@/schema';

const Register = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, isAuthenticated, error, user } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegister>({
    resolver: yupResolver(registerSchema),
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      // Role-based redirection
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit: SubmitHandler<IRegister> = async (data) => {
    await dispatch(registerUser(data));
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
            <CardTitle className='text-2xl'>Create Account</CardTitle>
            <CardDescription>Join Course Master and start your learning journey</CardDescription>
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
              <Label htmlFor='name'>Full Name</Label>
              <Input id='name' type='text' placeholder='John Doe' {...register('name')} />
              {errors.name && <p className='text-sm text-red-600'>{errors.name.message}</p>}
            </div>

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

            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Confirm Password</Label>
              <Input
                id='confirmPassword'
                type='password'
                placeholder='••••••••'
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className='text-sm text-red-600'>{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>

            <div className='text-center text-sm'>
              <span className='text-gray-600'>Already have an account? </span>
              <Link href='/login' className='text-blue-600 hover:text-blue-700 font-medium'>
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
