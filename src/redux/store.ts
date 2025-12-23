import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import courseReducer from './features/courseSlice';
import enrollmentReducer from './features/enrollmentSlice';
import adminReducer from './features/adminSlice';
import uiReducer from './features/uiSlice';
import cartReducer from './features/cartSlice';
import paymentReducer from './features/paymentSlice';
import chatReducer from './features/chatSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    course: courseReducer,
    enrollment: enrollmentReducer,
    admin: adminReducer,
    ui: uiReducer,
    cart: cartReducer,
    payment: paymentReducer,
    chat: chatReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

