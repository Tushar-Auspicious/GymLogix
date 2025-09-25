import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit'; // adjust the import path to your actual file
import {ActivePlanListItem} from '../../Seeds/Plans';

interface PlanState {
  planData: ActivePlanListItem[] | null;
}

const initialState: PlanState = {
  planData: null,
};

const planSlice = createSlice({
  name: 'planData',
  initialState,
  reducers: {
    setPlanData(state, action: PayloadAction<ActivePlanListItem[]>) {
      state.planData = action.payload;
    },

    updateExerciseInaPlan(
      state,
      action: PayloadAction<{
        planId: number; // e.g. 1088
        dayId: string; // e.g. "Day 1"
        exercise:
          | {
              exercise_id: number;
              sets: number;
              reps: number;
              timing_warmup?: number;
              timing_workset?: number;
              timing_finish?: number;
              Is_time?: boolean;
              is_weight?: boolean;
              Is_distance?: boolean;
              alternate_exercise_id?: number[];
            }
          | Array<any>;
        groupIndex?: number;
      }>,
    ) {
      if (!state.planData) return;

      const {planId, dayId, exercise, groupIndex} = action.payload;
      const exercisesToAdd = Array.isArray(exercise) ? exercise : [exercise];

      state.planData = state.planData.map(plan => {
        if (plan.allData?.plan_id !== planId) return plan;

        return {
          ...plan,
          allData: {
            ...plan.allData,
            content: {
              ...plan.allData.content,
              workouts: plan.allData?.content?.workouts?.map(workout => {
                //  match workout by name
                if (workout.name !== dayId) {
                  return workout;
                }

                const groups = workout.exercises ?? [];
                const idx = typeof groupIndex === 'number' ? groupIndex : 0;

                if (groups[idx]) {
                  //  append to existing group
                  const updatedGroup = {
                    ...groups[idx],
                    workout_exercises: [
                      ...groups[idx].workout_exercises,
                      ...exercisesToAdd,
                    ],
                  };

                  return {
                    ...workout,
                    exercises: groups.map((g, i) =>
                      i === idx ? updatedGroup : g,
                    ),
                  };
                } else {
                  //  create new group if none exist
                  return {
                    ...workout,
                    exercises: [
                      ...groups,
                      {type: 'custom', workout_exercises: exercisesToAdd},
                    ],
                  };
                }
              }),
            },
          },
        };
      });
    },
  },
});

export const {setPlanData, updateExerciseInaPlan} = planSlice.actions;
export default planSlice.reducer;
