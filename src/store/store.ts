import { configureStore } from '@reduxjs/toolkit';
import { aboutReducer } from './slices/aboutSlice';
import { revenueReducer } from './slices/revenueSlice';

const store = configureStore({
  reducer: {
    about: aboutReducer,
    revenue: revenueReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
