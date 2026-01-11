import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Course } from '@/types';

interface CartItem {
    course: Course;
    addedAt: string;
}

interface CartState {
    items: CartItem[];
    isLoading: boolean;
}

const initialState: CartState = {
    items: [],
    isLoading: false,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<Course>) => {
            const exists = state.items.some((item) => item.course._id === action.payload._id);
            if (!exists) {
                state.items.push({
                    course: action.payload,
                    addedAt: new Date().toISOString(),
                });
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((item) => item.course._id !== action.payload);
        },
        clearCart: (state) => {
            state.items = [];
        },
        applyCoupon: (state, action: PayloadAction<string>) => {
        },
    },
});

export const { addToCart, removeFromCart, clearCart, applyCoupon } = cartSlice.actions;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartTotal = (state: { cart: CartState }) =>
    state.cart.items.reduce((total, item) => total + item.course.price, 0);
export const selectCartCount = (state: { cart: CartState }) => state.cart.items.length;

export default cartSlice.reducer;
