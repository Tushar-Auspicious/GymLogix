import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface ScheduleAPIData {
  type: string;
  status: string;
  schedule_at: string;
  content: any;
  user_id: number;
  updated_at: string;
  created_at: string;
  id: string;
  finish_at?: string;
}

interface scheduleState {
  scheduleData: ScheduleAPIData[] | null;
}

const initialState: scheduleState = {
  scheduleData: null,
};

const scheduleSlice = createSlice({
  name: 'scheduleData',
  initialState,
  reducers: {
    setScheduleData(state, action: PayloadAction<ScheduleAPIData[] | null>) {
      state.scheduleData = action.payload;
    },
    addSchedule(state, action: PayloadAction<ScheduleAPIData[] | null>) {
      if (!state.scheduleData) {
        state.scheduleData = action.payload;
      } else if (action.payload) {
        state.scheduleData.push(...action.payload);
      }
    },
  },
});

export const {setScheduleData, addSchedule} = scheduleSlice.actions;
export default scheduleSlice.reducer;
