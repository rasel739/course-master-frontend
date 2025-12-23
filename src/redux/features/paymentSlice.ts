import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { Payment, PaymentIntentResponse } from '@/types';
import { paymentApi } from '@/helpers/axios/api';
import { getErrorMessage } from '@/utils';

interface PaymentState {
    clientSecret: string | null;
    paymentIntentId: string | null;
    payments: Payment[];
    isLoading: boolean;
    error: string | null;
}

const initialState: PaymentState = {
    clientSecret: null,
    paymentIntentId: null,
    payments: [],
    isLoading: false,
    error: null,
};

export const createPaymentIntent = createAsyncThunk(
    'payment/createPaymentIntent',
    async (courseIds: string[], { rejectWithValue }) => {
        try {
            const response = await paymentApi.createPaymentIntent(courseIds);
            return response.data.data!;
        } catch (error: unknown) {
            const message = getErrorMessage(error);
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const fetchPaymentHistory = createAsyncThunk(
    'payment/fetchPaymentHistory',
    async (_, { rejectWithValue }) => {
        try {
            const response = await paymentApi.getPaymentHistory();
            return response.data.data!;
        } catch (error: unknown) {
            const message = getErrorMessage(error);
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const verifyPayment = createAsyncThunk(
    'payment/verifyPayment',
    async (paymentIntentId: string, { rejectWithValue }) => {
        try {
            const response = await paymentApi.verifyPaymentStatus(paymentIntentId);
            return response.data.data!;
        } catch (error: unknown) {
            const message = getErrorMessage(error);
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        clearPaymentState: (state) => {
            state.clientSecret = null;
            state.paymentIntentId = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createPaymentIntent.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createPaymentIntent.fulfilled, (state, action) => {
                state.isLoading = false;
                state.clientSecret = action.payload.clientSecret;
                state.paymentIntentId = action.payload.paymentIntentId;
                state.error = null;
            })
            .addCase(createPaymentIntent.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(fetchPaymentHistory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.payments = action.payload;
                state.error = null;
            })
            .addCase(fetchPaymentHistory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(verifyPayment.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(verifyPayment.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(verifyPayment.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearPaymentState, clearError } = paymentSlice.actions;
export default paymentSlice.reducer;
