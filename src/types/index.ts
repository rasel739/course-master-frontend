export type UserRole = 'student' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string | null;
  enrolledCourses: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  registrationKey?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
}

export type CourseCategory =
  | 'Web Development'
  | 'Mobile Development'
  | 'Data Science'
  | 'AI/ML'
  | 'DevOps'
  | 'Other';

export interface Lesson {
  _id: string;
  title: string;
  videoUrl: string;
  duration: number;
  order: number;
}

export interface Module {
  _id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
  order: number;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  category: CourseCategory;
  tags: string[];
  price: number;
  thumbnail?: string;
  modules: Module[];
  batch: {
    number: number;
    startDate: string;
  };
  totalEnrollments: number;
  isPublished: boolean;
  totalLessons?: number;
  totalDuration?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourseQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  tags?: string | string[];
  sortBy?: string;
  order?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
}

export interface CoursePagination {
  currentPage: number;
  totalPages: number;
  totalCourses: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface CourseResponse {
  courses: Course[];
  pagination: CoursePagination;
  cached?: boolean;
}

export interface CompletedLesson {
  moduleId: string;
  lessonId: string;
  completedAt: string;
}

export interface Enrollment {
  _id: string;
  user: string | User;
  course: string | Course;
  progress: number;
  completedLessons: CompletedLesson[];
  enrolledAt: string;
  lastAccessedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface MarkLessonCompleteRequest {
  enrollmentId: string;
  moduleId: string;
  lessonId: string;
}

export interface Submission {
  _id: string;
  user: string | User;
  submissionType: 'link' | 'text';
  content: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
}

export interface Assignment {
  _id: string;
  course: string | Course;
  module: string;
  title: string;
  description: string;
  submissions: Submission[];
  createdAt: string;
  updatedAt: string;
}

export interface SubmitAssignmentRequest {
  submissionType: 'link' | 'text';
  content: string;
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizAttempt {
  _id: string;
  user: string | User;
  answers: number[];
  score: number;
  attemptedAt: string;
}

export interface Quiz {
  _id: string;
  course: string | Course;
  module: string;
  title: string;
  questions: Question[];
  attempts: QuizAttempt[];
  createdAt: string;
  updatedAt: string;
}

export interface SubmitQuizResponse {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
}

export interface CreateModuleRequest {
  title: string;
  description?: string;
  order?: number;
}

export interface CreateLessonRequest {
  title: string;
  videoUrl: string;
  duration: number;
  order?: number;
}

export interface ReorderRequest {
  moduleOrders?: { moduleId: string; order: number }[];
  lessonOrders?: { lessonId: string; order: number }[];
}

export interface EnrollmentTrend {
  _id: { year: number; month: number };
  count: number;
}

export interface CoursesByCategory {
  _id: string;
  count: number;
  avgPrice: number;
  totalEnrollments: number;
}

export interface AnalyticsData {
  overview: {
    totalCourses: number;
    totalEnrollments: number;
    totalStudents: number;
  };
  enrollmentTrends: EnrollmentTrend[];
  coursesByCategory: CoursesByCategory[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: unknown;
  statusCode: number;
}

export interface ApiError {
  success: false;
  message: string;
  errorMessages?: Array<{
    path: string | number;
    message: string;
  }>;
  stack?: string;
}
