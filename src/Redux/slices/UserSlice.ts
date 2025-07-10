import {createSlice, PayloadAction} from '@reduxjs/toolkit'; // adjust the import path to your actual file
import {User, UserResponse} from '../../Typings/ApiResponse/UserResponse';

interface UserState {
  userData: User | null;
}

const initialState: UserState = {
  userData: null,
};

const userSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    setUserData(state, action: PayloadAction<User>) {
      state.userData = action.payload;
    },
    clearUserData(state) {
      state.userData = null;
    },
  },
});

export const {setUserData, clearUserData} = userSlice.actions;
export default userSlice.reducer;
