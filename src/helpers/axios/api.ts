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
  getCourses: (params?: CourseQuery) =>
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
        pagination: any;
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
    axiosInstance.put<ApiResponse<any>>(
      `/admin/assignments/${assignmentId}/submissions/${submissionId}/grade`,
      data
    ),

  createQuiz: (data: Partial<Quiz>) =>
    axiosInstance.post<ApiResponse<Quiz>>('/admin/quizzes', data),

  getAnalytics: (params?: { startDate?: string; endDate?: string }) =>
    axiosInstance.get<ApiResponse<IAnalyticsData>>('/admin/analytics', {
      params,
    }),
};
