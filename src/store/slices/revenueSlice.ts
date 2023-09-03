import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type RevenueData = { month: string; year: number; amount: number };

type RevenueState = {
  data: RevenueData[];
};

const initialState: RevenueState = {
  data: [
    { month: 'January', year: 2023, amount: 600 },
    {
      month: 'February',
      year: 2023,
      amount: 700,
    },
    { month: 'March', year: 2023, amount: 800 },
    { month: 'April', year: 2023, amount: 900 },
  ],
};

const revenueSlice = createSlice({
  name: 'revenue',
  initialState,
  reducers: {
    addData: (state, action: PayloadAction<RevenueData>) => {
      state.data.push(action.payload);
    },
    removeData: (state, action: PayloadAction<RevenueData>) => {
      state.data = state.data.filter((month) => month.month !== action.payload.month);
    },
    updateData: (state, action: PayloadAction<RevenueData[]>) => {
      state.data = action.payload;
    },
  },
});

export const { reducer: revenueReducer, actions: revenueActions } = revenueSlice;
