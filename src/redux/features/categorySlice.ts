import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Category } from '@/types';
import { categoryApi } from '@/helpers/axios/api';

interface CategoryState {
    categories: Category[];
    loading: boolean;
    error: string | null;
}

const initialState: CategoryState = {
    categories: [],
    loading: false,
    error: null,
};

export const fetchCategories = createAsyncThunk(
    'category/fetchCategories',
    async (includeInactive: boolean = false, { rejectWithValue }) => {
        try {
            const response = await categoryApi.getCategories(includeInactive);
            return response.data.data || [];
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch categories');
        }
    }
);

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        clearCategoryError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;
