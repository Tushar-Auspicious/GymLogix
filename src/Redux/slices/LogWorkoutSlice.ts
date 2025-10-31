import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {SetDetail} from '../../Seeds/TrainingPLans';

// types/workout.ts
export type SetData = {
  weight: string;
  reps: string;
  time: string;
  count: number;
  difficulty?: 'Warmup' | 'Easy' | 'Medium' | 'Hard'; // Optional difficulty level
  distance?: string; // Optional distance field for cardio exercises
  dropSets?: SetDetail[]; // Optional drop sets
  exerciseID?: string;
  logTime: string;
};

export type ExerciseLog = {
  exercise_id: string;
  setsData: SetData[];
  isDropSet: boolean;
  logTime: string;
};

export type DraftWorkout = {
  workoutPlanId: number;
  workoutId: number; // program/workout id
  exercises: ExerciseLog[];
};

interface WorkoutState {
  draftWorkout: DraftWorkout[];
  workoutPlanId: number | null; // Track selected plan
  workoutId: number | null;
  workoutTime: number | null;
  workoutProgress: string;
  currentWorkout: {
    planId: number | null;
    workoutName: string | null;
    dayName: string | null;
  };
  currentCompletedExerciseIds: string[];
}

const initialState: WorkoutState = {
  draftWorkout: [],
  workoutPlanId: null, // Track selected plan
  workoutId: null,
  workoutTime: 0,
  workoutProgress: '',
  currentWorkout: {planId: null, workoutName: null, dayName: null},
  currentCompletedExerciseIds: [],
};

const logWorkoutSlice = createSlice({
  name: 'logWorkoutData',
  initialState,
  reducers: {
    setDraftWorkout(state, action: PayloadAction<DraftWorkout>) {
      // Check if a draftWorkout with the same workoutPlanId and workoutId exists
      const existingIndex = state.draftWorkout.findIndex(
        workout =>
          workout.workoutPlanId === action.payload.workoutPlanId &&
          workout.workoutId === action.payload.workoutId,
      );
      if (existingIndex >= 0) {
        // Update existing draftWorkout
        state.draftWorkout[existingIndex] = action.payload;
      } else {
        // Add new draftWorkout
        state.draftWorkout.push(action.payload);
      }
    },
    updateExercise(
      state,
      action: PayloadAction<
        ExerciseLog & {workoutPlanId: number; workoutId: number}
      >,
    ) {
      // Find the draftWorkout for the given workoutPlanId and workoutId
      const workout = state.draftWorkout.find(
        w =>
          w.workoutPlanId === action.payload.workoutPlanId &&
          w.workoutId === action.payload.workoutId,
      );
      if (!workout) {
        // If no draftWorkout exists, create one
        state.draftWorkout.push({
          workoutPlanId: action.payload.workoutPlanId,
          workoutId: action.payload.workoutId,
          exercises: [action.payload],
        });
      } else {
        const idx = workout.exercises.findIndex(
          ex => ex.exercise_id === action.payload.exercise_id,
        );
        if (idx >= 0) {
          workout.exercises[idx] = action.payload;
        } else {
          workout.exercises.push(action.payload);
        }
      }
    },

    clearDraftWorkout(state) {
      state.draftWorkout = [];
    },
    // Optional: Add reducer to clear a specific workout
    clearSpecificDraftWorkout(
      state,
      action: PayloadAction<{workoutPlanId: number; workoutId: number}>,
    ) {
      state.draftWorkout = state.draftWorkout.filter(
        workout =>
          !(
            workout.workoutPlanId === action.payload.workoutPlanId &&
            workout.workoutId === action.payload.workoutId
          ),
      );
    },
    setWorkoutTime(state, action: PayloadAction<number | null>) {
      state.workoutTime = action.payload;
    },
    setWorkoutProgress(state, action: PayloadAction<string>) {
      state.workoutProgress = action.payload;
    },
    setCurrentWorkout(
      state,
      action: PayloadAction<{
        planId: number;
        workoutName: string | any;
        dayName: string;
      }>,
    ) {
      state.currentWorkout = action.payload;
    },

    setCurrentCompletedExerciseIds(state, action: PayloadAction<string>) {
      state.currentCompletedExerciseIds.push(action.payload);
    },

    resetWorkout(state) {
      state.workoutTime = 0;
      state.workoutProgress = '';
      state.currentWorkout = {planId: null, workoutName: null, dayName: null};
    },
  },
});

export const {
  setDraftWorkout,
  updateExercise,
  clearDraftWorkout,
  clearSpecificDraftWorkout,
  setWorkoutProgress,
  setWorkoutTime,
  resetWorkout,
  setCurrentCompletedExerciseIds,
  setCurrentWorkout,
} = logWorkoutSlice.actions;

export default logWorkoutSlice.reducer;
