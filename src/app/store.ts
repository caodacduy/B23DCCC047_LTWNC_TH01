/**
 * Buổi 3 — Redux Toolkit + TypeScript: Cấu hình Store tập trung
 */
import { configureStore } from '@reduxjs/toolkit';
import deadlineReducer from '../features/deadlines/deadlineSlice';

export const store = configureStore({
  reducer: {
    deadlines: deadlineReducer,
  },
  devTools: import.meta.env.DEV,
});

// Infer RootState và AppDispatch từ chính Store để đảm bảo type safety tuyệt đối
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
