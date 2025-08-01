import {createSlice, PayloadAction} from '@reduxjs/toolkit'; // adjust the import path to your actual file
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
  },
});

export const {setPlanData} = planSlice.actions;
export default planSlice.reducer;
