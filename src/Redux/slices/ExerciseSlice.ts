import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  ExerciseAPIData,
  ExerciseResponse,
} from '../../Typings/ApiResponse/ExerciseResponse';

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
  },
});

export const {setExerciseData} = exerciseSlice.actions;
export default exerciseSlice.reducer;
