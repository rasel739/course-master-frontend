import { categories } from '@/constants';
import * as yup from 'yup';

export const registerSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .required('Name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(16, 'Password cannot exceed 16 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export const loginSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const moduleSchema = yup.object({
  title: yup
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title cannot exceed 200 characters')
    .required('Title is required'),
  description: yup.string().max(1000, 'Description cannot exceed 1000 characters').optional(),
  order: yup
    .number()
    .integer('Order must be an integer')
    .min(1, 'Order must be at least 1')
    .optional(),
});

export const lessonSchema = yup.object({
  title: yup
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title cannot exceed 200 characters')
    .required('Title is required'),
  videoUrl: yup.string().url('Video URL must be a valid URL').required('Video URL is required'),
  duration: yup
    .number()
    .min(1, 'Duration must be at least 1 minute')
    .max(600, 'Duration cannot exceed 600 minutes')
    .required('Duration is required'),
  order: yup
    .number()
    .integer('Order must be an integer')
    .min(1, 'Order must be at least 1')
    .optional(),
});

export const createCourseSchema = yup.object({
  title: yup
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters')
    .required('Title is required'),
  description: yup
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description cannot exceed 2000 characters')
    .required('Description is required'),
  instructor: yup
    .string()
    .min(2, 'Instructor name must be at least 2 characters')
    .max(100, 'Instructor name cannot exceed 100 characters')
    .required('Instructor is required'),
  category: yup.string().oneOf(categories, 'Invalid category').required('Category is required'),
  price: yup.number().min(0, 'Price cannot be negative').required('Price is required'),
  thumbnail: yup.string().url('Must be a valid URL').optional(),
  tags: yup.string().optional(),
});

export const editCourseSchema = yup.object({
  title: yup
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters')
    .required('Title is required'),
  description: yup
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description cannot exceed 2000 characters')
    .required('Description is required'),
  instructor: yup
    .string()
    .min(2, 'Instructor name must be at least 2 characters')
    .max(100, 'Instructor name cannot exceed 100 characters')
    .required('Instructor is required'),
  category: yup.string().oneOf(categories, 'Invalid category').required('Category is required'),
  price: yup.number().min(0, 'Price cannot be negative').required('Price is required'),
  thumbnail: yup.string().url('Must be a valid URL').optional(),
  tags: yup.string().optional(),
  isPublished: yup.boolean().required(),
});
