import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  Course,
  Assignment,
  Quiz,
  IAnalyticsData,
  CreateModuleRequest,
  CreateLessonRequest,
  Enrollment,
  IAnalyticsParams,
  AssignmentsResponse,
  QuizzesResponse,
  AllEnrollmentsResponse,
} from '@/types';
import toast from 'react-hot-toast';
import { adminApi } from '@/helpers/axios/api';
import { getErrorMessage } from '@/utils';

interface AdminState {
  courses: Course[];
  selectedCourse: Course | null;
  assignments: Assignment[];
  quizzes: Quiz[];
  analytics: IAnalyticsData | null;
  enrollments: Enrollment[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  courses: [],
  selectedCourse: null,
  assignments: [],
  quizzes: [],
  analytics: null,
  enrollments: [],
  isLoading: false,
  error: null,
};

// Course Management
export const createCourse = createAsyncThunk(
  'admin/createCourse',
  async (courseData: Partial<Course>, { rejectWithValue }) => {
    try {
      const response = await adminApi.createCourse(courseData);
      toast.success('Course created successfully!');
      return response.data.data!;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateCourse = createAsyncThunk(
  'admin/updateCourse',
  async ({ id, data }: { id: string; data: Partial<Course> }, { rejectWithValue }) => {
    try {
      const response = await adminApi.updateCourse(id, data);
      toast.success('Course updated successfully!');
      return response.data.data!;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteCourse = createAsyncThunk(
  'admin/deleteCourse',
  async (id: string, { rejectWithValue }) => {
    try {
      await adminApi.deleteCourse(id);
      toast.success('Course deleted successfully!');
      return id;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchCourseEnrollments = createAsyncThunk(
  'admin/fetchCourseEnrollments',
  async (
    { courseId, params }: { courseId: string; params?: { page?: number; limit?: number } },
    { rejectWithValue }
  ) => {
    try {
      const response = await adminApi.getCourseEnrollments(courseId, params);
      return response.data.data!;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Module Management
export const addModule = createAsyncThunk(
  'admin/addModule',
  async (
    { courseId, data }: { courseId: string; data: CreateModuleRequest },
    { rejectWithValue }
  ) => {
    try {
      const response = await adminApi.addModule(courseId, data);
      toast.success('Module added successfully!');
      return response.data.data!;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateModule = createAsyncThunk(
  'admin/updateModule',
  async (
    {
      courseId,
      moduleId,
      data,
    }: {
      courseId: string;
      moduleId: string;
      data: Partial<CreateModuleRequest>;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await adminApi.updateModule(courseId, moduleId, data);
      toast.success('Module updated successfully!');
      return response.data.data!;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteModule = createAsyncThunk(
  'admin/deleteModule',
  async ({ courseId, moduleId }: { courseId: string; moduleId: string }, { rejectWithValue }) => {
    try {
      const response = await adminApi.deleteModule(courseId, moduleId);
      toast.success('Module deleted successfully!');
      return response.data.data!;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Lesson Management
export const addLesson = createAsyncThunk(
  'admin/addLesson',
  async (
    { courseId, moduleId, data }: { courseId: string; moduleId: string; data: CreateLessonRequest },
    { rejectWithValue }
  ) => {
    try {
      const response = await adminApi.addLesson(courseId, moduleId, data);
      toast.success('Lesson added successfully!');
      return response.data.data!;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateLesson = createAsyncThunk(
  'admin/updateLesson',
  async (
    {
      courseId,
      moduleId,
      lessonId,
      data,
    }: {
      courseId: string;
      moduleId: string;
      lessonId: string;
      data: Partial<CreateLessonRequest>;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await adminApi.updateLesson(courseId, moduleId, lessonId, data);
      toast.success('Lesson updated successfully!');
      return response.data.data!;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteLesson = createAsyncThunk(
  'admin/deleteLesson',
  async (
    { courseId, moduleId, lessonId }: { courseId: string; moduleId: string; lessonId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await adminApi.deleteLesson(courseId, moduleId, lessonId);
      toast.success('Lesson deleted successfully!');
      return response.data.data!;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const createAssignment = createAsyncThunk(
  'admin/createAssignment',
  async (assignmentData: Partial<Assignment>, { rejectWithValue }) => {
    try {
      const response = await adminApi.createAssignment(assignmentData);
      toast.success('Assignment created successfully!');
      return response.data.data!;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchAssignmentSubmissions = createAsyncThunk(
  'admin/fetchAssignmentSubmissions',
  async (assignmentId: string, { rejectWithValue }) => {
    try {
      const response = await adminApi.getAssignmentSubmissions(assignmentId);
      return response.data.data!;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const gradeAssignment = createAsyncThunk(
  'admin/gradeAssignment',
  async (
    {
      assignmentId,
      submissionId,
      data,
    }: {
      assignmentId: string;
      submissionId: string;
      data: { grade: number; feedback?: string };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await adminApi.gradeAssignment(assignmentId, submissionId, data);
      toast.success('Assignment graded successfully!');
      return response.data.data!;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const createQuiz = createAsyncThunk(
  'admin/createQuiz',
  async (quizData: Partial<Quiz>, { rejectWithValue }) => {
    try {
      const response = await adminApi.createQuiz(quizData);
      toast.success('Quiz created successfully!');
      return response.data.data!;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchAnalytics = createAsyncThunk<
  IAnalyticsData,
  IAnalyticsParams | undefined,
  { rejectValue: string }
>('admin/fetchAnalytics', async (params, { rejectWithValue }) => {
  try {
    const response = await adminApi.getAnalytics(params);
    return response.data.data!;
  } catch (error) {
    const message = getErrorMessage(error);
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const fetchAssignments = createAsyncThunk<
  AssignmentsResponse,
  { page?: number; limit?: number } | undefined,
  { rejectValue: string }
>('admin/fetchAssignments', async (params, { rejectWithValue }) => {
  try {
    const response = await adminApi.getAssignments(params);
    return response.data.data!;
  } catch (error) {
    const message = getErrorMessage(error);
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const fetchQuizzes = createAsyncThunk<
  QuizzesResponse,
  { page?: number; limit?: number } | undefined,
  { rejectValue: string }
>('admin/fetchQuizzes', async (params, { rejectWithValue }) => {
  try {
    const response = await adminApi.getQuizzes(params);
    return response.data.data!;
  } catch (error) {
    const message = getErrorMessage(error);
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const fetchAllEnrollments = createAsyncThunk<
  AllEnrollmentsResponse,
  { page?: number; limit?: number } | undefined,
  { rejectValue: string }
>('admin/fetchAllEnrollments', async (params, { rejectWithValue }) => {
  try {
    const response = await adminApi.getAllEnrollments(params);
    return response.data.data!;
  } catch (error) {
    const message = getErrorMessage(error);
    toast.error(message);
    return rejectWithValue(message);
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedCourse: (state, action: PayloadAction<Course | null>) => {
      state.selectedCourse = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courses.push(action.payload);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Course
    builder
      .addCase(updateCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.courses.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
        if (state.selectedCourse?._id === action.payload._id) {
          state.selectedCourse = action.payload;
        }
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete Course
    builder
      .addCase(deleteCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courses = state.courses.filter((c) => c._id !== action.payload);
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Course Enrollments
    builder
      .addCase(fetchCourseEnrollments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourseEnrollments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.enrollments = action.payload.enrollments;
      })
      .addCase(fetchCourseEnrollments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Add Module
    builder.addCase(addModule.fulfilled, (state, action) => {
      state.selectedCourse = action.payload;
    });

    // Update Module
    builder.addCase(updateModule.fulfilled, (state, action) => {
      state.selectedCourse = action.payload;
    });

    // Delete Module
    builder.addCase(deleteModule.fulfilled, (state, action) => {
      state.selectedCourse = action.payload;
    });

    // Add Lesson
    builder.addCase(addLesson.fulfilled, (state, action) => {
      state.selectedCourse = action.payload;
    });

    // Update Lesson
    builder.addCase(updateLesson.fulfilled, (state, action) => {
      state.selectedCourse = action.payload;
    });

    // Delete Lesson
    builder.addCase(deleteLesson.fulfilled, (state, action) => {
      state.selectedCourse = action.payload;
    });

    // Create Assignment
    builder.addCase(createAssignment.fulfilled, (state, action) => {
      state.assignments.push(action.payload);
    });

    // Create Quiz
    builder.addCase(createQuiz.fulfilled, (state, action) => {
      state.quizzes.push(action.payload);
    });

    // Fetch Analytics
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Assignments
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.assignments = action.payload.assignments;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Quizzes
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quizzes = action.payload.quizzes;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch All Enrollments
    builder
      .addCase(fetchAllEnrollments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllEnrollments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.enrollments = action.payload.enrollments;
      })
      .addCase(fetchAllEnrollments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setSelectedCourse } = adminSlice.actions;
export default adminSlice.reducer;
