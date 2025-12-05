import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { Course, CourseQuery, CoursePagination } from '@/types';
import { courseApi } from '@/helpers/axios/api';
import { getErrorMessage } from '@/utils';
import toast from 'react-hot-toast';

interface CourseState {
  courses: Course[];
  selectedCourse: Course | null;
  pagination: CoursePagination | null;
  isLoading: boolean;
  error: string | null;
  filters: CourseQuery;
}

const initialState: CourseState = {
  courses: [],
  selectedCourse: null,
  pagination: null,
  isLoading: false,
  error: null,
  filters: {
    page: 1,
    limit: 12,
    sortBy: 'createdAt',
    order: 'desc',
  },
};

// Async thunks
export const fetchCourses = createAsyncThunk(
  'course/fetchCourses',
  async (query: CourseQuery, { rejectWithValue }) => {
    try {
      const response = await courseApi.getCourses(query);
      return response.data.data!;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  'course/fetchCourseById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await courseApi.getCourseById(id);
      return response.data.data!;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<CourseQuery>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearSelectedCourse: (state) => {
      state.selectedCourse = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Courses
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courses = action.payload.courses;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Course By ID
    builder
      .addCase(fetchCourseById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedCourse = action.payload;
        state.error = null;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters, clearSelectedCourse, clearError } = courseSlice.actions;
export default courseSlice.reducer;
