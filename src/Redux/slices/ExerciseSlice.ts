import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ExerciseAPIData} from '../../Typings/ApiResponse/ExerciseResponse';

interface exerciseState {
  exerciseData: ExerciseAPIData[] | null;
}

const initialState: exerciseState = {
  exerciseData: null,
};

const exerciseSlice = createSlice({
  name: 'exerciseData',
  initialState,
  reducers: {
    setExerciseData(state, action: PayloadAction<ExerciseAPIData[]>) {
      state.exerciseData = action.payload;
    },
    updateExerciseOrder(state, action: PayloadAction<ExerciseAPIData[]>) {
      state.exerciseData = action.payload;
    },
  },
});

export const {setExerciseData, updateExerciseOrder} = exerciseSlice.actions;
export default exerciseSlice.reducer;
