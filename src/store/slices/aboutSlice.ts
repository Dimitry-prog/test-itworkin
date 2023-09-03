import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type CustomTextType = {
  partOne: string;
  partTwo: string;
};

type AboutState = {
  customText: CustomTextType;
};

const initialState: AboutState = {
  customText: {
    partOne: 'one',
    partTwo: 'two',
  },
};

const aboutSlice = createSlice({
  name: 'about',
  initialState,
  reducers: {
    setCustomText: (state, action: PayloadAction<CustomTextType>) => {
      state.customText = Object.assign(state.customText, action.payload);
    },
  },
});

export const { reducer: aboutReducer, actions: aboutActions } = aboutSlice;
