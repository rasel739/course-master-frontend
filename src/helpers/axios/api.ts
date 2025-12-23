import axiosInstance from './interceptors';
import {
  ILogin,
  IRegister,
  AuthResponse,
  User,
  CourseQuery,
  CourseResponse,
  Course,
  Enrollment,
  EnrollmentPagination,
  MarkLessonCompleteRequest,
  SubmitAssignmentRequest,
  SubmitQuizResponse,
  Assignment,
  Quiz,
  CreateModuleRequest,
  CreateLessonRequest,
  ReorderRequest,
  IAnalyticsData,
  ApiResponse,
  Submission,
  AssignmentsResponse,
  QuizzesResponse,
  AllEnrollmentsResponse,
  Payment,
  ChatConversation,
  ChatMessagesResponse,
  ChatMessage,
  CreateConversationRequest,
  SendMessageRequest,
  Instructor,
  Student,
} from '@/types';


export const authApi = {
  register: (data: IRegister) =>
    axiosInstance.post<ApiResponse<AuthResponse>>('/auth/register', data),

  login: (data: ILogin) => axiosInstance.post<ApiResponse<AuthResponse>>('/auth/login', data),

  logout: () => axiosInstance.post<ApiResponse>('/auth/logout'),

  getMe: () => axiosInstance.get<ApiResponse<User>>('/auth/me'),

  refreshToken: () =>
    axiosInstance.post<ApiResponse<{ accessToken: string }>>('/auth/refresh-token'),
};

export const courseApi = {
  getCourses: (params: CourseQuery) =>
    axiosInstance.get<ApiResponse<CourseResponse>>('/course', { params }),

  getCourseById: (id: string) => axiosInstance.get<ApiResponse<Course>>(`/course/${id}`),
};

export const studentApi = {
  enrollCourse: (courseId: string) =>
    axiosInstance.post<ApiResponse<Enrollment>>(`/students/enroll/${courseId}`),

  getDashboard: () =>
    axiosInstance.get<ApiResponse<{ enrollments: Enrollment[]; totalCourses: number }>>(
      '/students/dashboard'
    ),

  getEnrollmentDetails: (enrollmentId: string) =>
    axiosInstance.get<ApiResponse<Enrollment>>(`/students/enrollments/${enrollmentId}`),

  markLessonComplete: (data: MarkLessonCompleteRequest) =>
    axiosInstance.post<ApiResponse<{ progress: number; completedLessons: number }>>(
      '/students/progress',
      data
    ),

  submitAssignment: (assignmentId: string, data: SubmitAssignmentRequest) =>
    axiosInstance.post<ApiResponse<{ message: string }>>(
      `/students/assignments/${assignmentId}/submit`,
      data
    ),

  submitQuiz: (quizId: string, answers: number[]) =>
    axiosInstance.post<ApiResponse<SubmitQuizResponse>>(`/students/quizzes/${quizId}/submit`, {
      answers,
    }),

  getAssignmentsByCourse: (courseId: string) =>
    axiosInstance.get<ApiResponse<Assignment[]>>(`/students/courses/${courseId}/assignments`),

  getQuizzesByCourse: (courseId: string) =>
    axiosInstance.get<ApiResponse<Quiz[]>>(`/students/courses/${courseId}/quizzes`),

  getQuizById: (quizId: string) =>
    axiosInstance.get<ApiResponse<{ _id: string; title: string; questions: { question: string; options: string[] }[] }>>(`/students/quizzes/${quizId}`),
};

export const adminApi = {
  createCourse: (data: Partial<Course>) =>
    axiosInstance.post<ApiResponse<Course>>('/admin/courses', data),

  updateCourse: (id: string, data: Partial<Course>) =>
    axiosInstance.put<ApiResponse<Course>>(`/admin/courses/${id}`, data),

  deleteCourse: (id: string) =>
    axiosInstance.delete<ApiResponse<{ message: string }>>(`/admin/courses/${id}`),

  getCourseEnrollments: (courseId: string, params?: { page?: number; limit?: number }) =>
    axiosInstance.get<
      ApiResponse<{
        enrollments: Enrollment[];
        pagination: EnrollmentPagination;
      }>
    >(`/admin/courses/${courseId}/enrollments`, { params }),

  addModule: (courseId: string, data: CreateModuleRequest) =>
    axiosInstance.post<ApiResponse<Course>>(`/admin/courses/${courseId}/modules`, data),

  updateModule: (courseId: string, moduleId: string, data: Partial<CreateModuleRequest>) =>
    axiosInstance.put<ApiResponse<Course>>(`/admin/courses/${courseId}/modules/${moduleId}`, data),

  deleteModule: (courseId: string, moduleId: string) =>
    axiosInstance.delete<ApiResponse<Course>>(`/admin/courses/${courseId}/modules/${moduleId}`),

  reorderModules: (courseId: string, data: ReorderRequest) =>
    axiosInstance.put<ApiResponse<Course>>(`/admin/courses/${courseId}/modules/reorder`, data),

  addLesson: (courseId: string, moduleId: string, data: CreateLessonRequest) =>
    axiosInstance.post<ApiResponse<Course>>(
      `/admin/courses/${courseId}/modules/${moduleId}/lessons`,
      data
    ),

  updateLesson: (
    courseId: string,
    moduleId: string,
    lessonId: string,
    data: Partial<CreateLessonRequest>
  ) =>
    axiosInstance.put<ApiResponse<Course>>(
      `/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
      data
    ),

  deleteLesson: (courseId: string, moduleId: string, lessonId: string) =>
    axiosInstance.delete<ApiResponse<Course>>(
      `/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`
    ),

  reorderLessons: (courseId: string, moduleId: string, data: ReorderRequest) =>
    axiosInstance.put<ApiResponse<Course>>(
      `/admin/courses/${courseId}/modules/${moduleId}/lessons/reorder`,
      data
    ),

  createAssignment: (data: Partial<Assignment>) =>
    axiosInstance.post<ApiResponse<Assignment>>('/admin/assignments', data),

  getAssignmentSubmissions: (assignmentId: string) =>
    axiosInstance.get<ApiResponse<{ assignment: Assignment; totalSubmissions: number }>>(
      `/admin/assignments/${assignmentId}/submissions`
    ),

  gradeAssignment: (
    assignmentId: string,
    submissionId: string,
    data: { grade: number; feedback?: string }
  ) =>
    axiosInstance.put<ApiResponse<{ submission: Submission }>>(
      `/admin/assignments/${assignmentId}/submissions/${submissionId}/grade`,
      data
    ),

  createQuiz: (data: Partial<Quiz>) =>
    axiosInstance.post<ApiResponse<Quiz>>('/admin/quizzes', data),

  getAnalytics: (params?: { startDate?: string; endDate?: string }) =>
    axiosInstance.get<ApiResponse<IAnalyticsData>>('/admin/analytics', {
      params,
    }),

  getAssignments: (params?: { page?: number; limit?: number }) =>
    axiosInstance.get<ApiResponse<AssignmentsResponse>>('/admin/assignments', { params }),

  getQuizzes: (params?: { page?: number; limit?: number }) =>
    axiosInstance.get<ApiResponse<QuizzesResponse>>('/admin/quizzes', { params }),

  getAllEnrollments: (params?: { page?: number; limit?: number }) =>
    axiosInstance.get<ApiResponse<AllEnrollmentsResponse>>('/admin/enrollments', { params }),

  getAssignmentsByCourse: (courseId: string) =>
    axiosInstance.get<ApiResponse<Assignment[]>>(`/admin/courses/${courseId}/assignments`),

  getQuizzesByCourse: (courseId: string) =>
    axiosInstance.get<ApiResponse<Quiz[]>>(`/admin/courses/${courseId}/quizzes`),
};

export const paymentApi = {
  createPaymentIntent: (courseIds: string[]) =>
    axiosInstance.post<ApiResponse<{ clientSecret: string; paymentIntentId: string; amount: number; currency: string }>>('/payment/create-payment-intent', { courseIds }),

  getPaymentHistory: () =>
    axiosInstance.get<ApiResponse<Payment[]>>('/payment/history'),

  verifyPaymentStatus: (paymentIntentId: string) =>
    axiosInstance.get<ApiResponse<{ status: string; enrolled: boolean }>>(`/payment/verify/${paymentIntentId}`),
};

export const chatApi = {
  getInstructors: () =>
    axiosInstance.get<ApiResponse<Instructor[]>>('/chat/instructors'),

  getStudents: () =>
    axiosInstance.get<ApiResponse<Student[]>>('/chat/students'),

  getUnreadCount: () =>
    axiosInstance.get<ApiResponse<{ unreadCount: number }>>('/chat/unread-count'),

  createConversation: (data: CreateConversationRequest) =>
    axiosInstance.post<ApiResponse<ChatConversation>>('/chat/conversations', data),

  getConversations: () =>
    axiosInstance.get<ApiResponse<ChatConversation[]>>('/chat/conversations'),

  getConversationById: (conversationId: string) =>
    axiosInstance.get<ApiResponse<ChatConversation>>(`/chat/conversations/${conversationId}`),

  getMessages: (conversationId: string, params?: { page?: number; limit?: number }) =>
    axiosInstance.get<ApiResponse<ChatMessagesResponse>>(
      `/chat/conversations/${conversationId}/messages`,
      { params }
    ),

  sendMessage: (conversationId: string, data: SendMessageRequest) =>
    axiosInstance.post<ApiResponse<ChatMessage>>(
      `/chat/conversations/${conversationId}/messages`,
      data
    ),

  markConversationAsRead: (conversationId: string) =>
    axiosInstance.put<ApiResponse>(`/chat/conversations/${conversationId}/read`),

  markMessageAsRead: (messageId: string) =>
    axiosInstance.put<ApiResponse>(`/chat/messages/${messageId}/read`),
};

// Review API
export const reviewApi = {
  getCourseReviews: (courseId: string, params?: { page?: number; limit?: number }) =>
    axiosInstance.get<ApiResponse<{
      reviews: {
        _id: string;
        user: { _id: string; name: string; avatar?: string };
        rating: number;
        content: string;
        helpful: number;
        notHelpful: number;
        createdAt: string;
      }[];
      pagination: { currentPage: number; totalPages: number; totalReviews: number };
      averageRating: number;
      ratingBreakdown: { stars: number; count: number }[];
    }>>(`/reviews/courses/${courseId}`, { params }),

  submitReview: (courseId: string, data: { rating: number; content: string }) =>
    axiosInstance.post<ApiResponse<{ _id: string }>>(`/reviews/courses/${courseId}`, data),

  voteReview: (reviewId: string, voteType: 'helpful' | 'notHelpful') =>
    axiosInstance.put<ApiResponse>(`/reviews/${reviewId}/vote`, { voteType }),

  deleteReview: (reviewId: string) =>
    axiosInstance.delete<ApiResponse>(`/reviews/${reviewId}`),
};

// Certificate API
export const certificateApi = {
  getUserCertificates: () =>
    axiosInstance.get<ApiResponse<{
      _id: string;
      course: { _id: string; title: string; thumbnail?: string; category: string };
      certificateNumber: string;
      issuedAt: string;
      courseTitleAtIssue: string;
      studentNameAtIssue: string;
    }[]>>('/certificates'),

  getCertificateById: (certificateId: string) =>
    axiosInstance.get<ApiResponse<{
      _id: string;
      user: { _id: string; name: string; email: string };
      course: { _id: string; title: string; category: string; instructor: string };
      certificateNumber: string;
      issuedAt: string;
      courseTitleAtIssue: string;
      studentNameAtIssue: string;
    }>>(`/certificates/${certificateId}`),

  verifyCertificate: (certificateNumber: string) =>
    axiosInstance.get<ApiResponse<{
      valid: boolean;
      certificate?: {
        _id: string;
        user: { name: string };
        course: { title: string };
        certificateNumber: string;
        issuedAt: string;
      };
    }>>(`/certificates/verify/${certificateNumber}`),

  generateCertificate: (enrollmentId: string) =>
    axiosInstance.post<ApiResponse<{
      _id: string;
      certificateNumber: string;
      issuedAt: string;
    }>>(`/certificates/generate/${enrollmentId}`),
};
