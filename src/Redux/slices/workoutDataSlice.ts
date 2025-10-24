import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface WorkoutState {
  isFinish: any[]; // Replace 'any' with a specific type for better type safety
  // Other existing state properties
}

const initialState: WorkoutState = {
  isFinish: [],
  // Other initial state properties
};

const workoutDataSlice = createSlice({
  name: 'workoutData',
  initialState,
  reducers: {
    setIsFinish(state, action: PayloadAction<any[]>) {
      state.isFinish = action.payload;
    },
    updateIsFinish(state, action: PayloadAction<any[]>) {
      state.isFinish = action.payload;
    },
    // Add other actions as needed
  },
});

export const {setIsFinish, updateIsFinish} = workoutDataSlice.actions;
export default workoutDataSlice.reducer;
