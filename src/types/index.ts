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

export interface ILogin {
  email: string;
  password: string;
}

export interface IRegister {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
}

export type CourseCategory = string;

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

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
  averageRating?: number;
  totalReviews?: number;
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

export interface IAnalyticsData {
  overview: {
    totalCourses: number;
    totalEnrollments: number;
    totalStudents: number;
  };
  enrollmentTrends: EnrollmentTrend[];
  coursesByCategory: CoursesByCategory[];
}

export interface IAnalyticsParams {
  startDate?: string;
  endDate?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: Record<string, unknown>;
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

export interface EnrollmentPagination {
  currentPage: number;
  totalPages: number;
  totalEnrollments: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface GradeAssignmentResponse {
  submission: Submission;
}

export interface AssignmentsPagination {
  currentPage: number;
  totalPages: number;
  totalAssignments: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface AssignmentsResponse {
  assignments: Assignment[];
  pagination: AssignmentsPagination;
}

export interface QuizzesPagination {
  currentPage: number;
  totalPages: number;
  totalQuizzes: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface QuizzesResponse {
  quizzes: Quiz[];
  pagination: QuizzesPagination;
}

export interface AllEnrollmentsPagination {
  currentPage: number;
  totalPages: number;
  totalEnrollments: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface AllEnrollmentsResponse {
  enrollments: Enrollment[];
  pagination: AllEnrollmentsPagination;
}

export interface Payment {
  _id: string;
  user: string;
  courses: string[] | Course[];
  stripePaymentIntentId: string;
  stripeCustomerId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  paymentMethod?: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

export interface ChatParticipant {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
}

export interface ChatMessage {
  _id: string;
  conversation: string;
  sender: {
    _id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatConversation {
  _id: string;
  participants: ChatParticipant[];
  course?: {
    _id: string;
    title: string;
  };
  lastMessage?: {
    _id: string;
    content: string;
    sender: string;
    createdAt: string;
  };
  lastMessageAt?: string;
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConversationRequest {
  participantId: string;
  courseId?: string;
  initialMessage?: string;
}

export interface SendMessageRequest {
  content: string;
}

export interface Instructor {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Student {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ChatMessagesPagination {
  currentPage: number;
  totalPages: number;
  totalMessages: number;
}

export interface ChatMessagesResponse {
  messages: ChatMessage[];
  pagination: ChatMessagesPagination;
}


