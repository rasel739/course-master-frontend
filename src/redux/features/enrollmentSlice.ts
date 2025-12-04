import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { Enrollment, MarkLessonCompleteRequest } from '@/types';
import toast from 'react-hot-toast';
import { studentApi } from '@/helpers/axios/api';

interface EnrollmentState {
  enrollments: Enrollment[];
  selectedEnrollment: Enrollment | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: EnrollmentState = {
  enrollments: [],
  selectedEnrollment: null,
  isLoading: false,
  error: null,
};

export const enrollInCourse = createAsyncThunk(
  'enrollment/enrollInCourse',
  async (courseId: string, { rejectWithValue }) => {
    try {
      const response = await studentApi.enrollCourse(courseId);
      toast.success('Successfully enrolled in course!');
      return response.data.data!;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Enrollment failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchDashboard = createAsyncThunk(
  'enrollment/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await studentApi.getDashboard();
      return response.data.data!.enrollments;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard');
    }
  }
);

export const fetchEnrollmentDetails = createAsyncThunk(
  'enrollment/fetchEnrollmentDetails',
  async (enrollmentId: string, { rejectWithValue }) => {
    try {
      const response = await studentApi.getEnrollmentDetails(enrollmentId);
      return response.data.data!;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch enrollment details');
    }
  }
);

export const markLessonComplete = createAsyncThunk(
  'enrollment/markLessonComplete',
  async (data: MarkLessonCompleteRequest, { rejectWithValue }) => {
    try {
      const response = await studentApi.markLessonComplete(data);
      toast.success('Lesson marked as complete!');
      return { ...response.data.data!, enrollmentId: data.enrollmentId };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to mark lesson complete';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const enrollmentSlice = createSlice({
  name: 'enrollment',
  initialState,
  reducers: {
    clearSelectedEnrollment: (state) => {
      state.selectedEnrollment = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(enrollInCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(enrollInCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.enrollments.push(action.payload);
        state.error = null;
      })
      .addCase(enrollInCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.enrollments = action.payload;
        state.error = null;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchEnrollmentDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEnrollmentDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedEnrollment = action.payload;
        state.error = null;
      })
      .addCase(fetchEnrollmentDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(markLessonComplete.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(markLessonComplete.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.selectedEnrollment) {
          state.selectedEnrollment.progress = action.payload.progress;
        }

        const enrollment = state.enrollments.find((e) => e._id === action.payload.enrollmentId);
        if (enrollment) {
          enrollment.progress = action.payload.progress;
        }
      })
      .addCase(markLessonComplete.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedEnrollment, clearError } = enrollmentSlice.actions;
export default enrollmentSlice.reducer;
