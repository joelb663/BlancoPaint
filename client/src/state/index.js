import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  token: null,
  isAdmin: null,
  selectedTab: 0,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.userId = action.payload.userId;
      state.token = action.payload.token;
      state.isAdmin = action.payload.isAdmin;
    },
    setLogout: (state) => {
      state.userId = null;
      state.token = null;
      state.isAdmin = null;
    },
    setSelectedTab: (state, action) => {
      state.selectedTab = action.payload;
    },
  },
});

export const { setLogin, setLogout, setSelectedTab } = authSlice.actions;
export default authSlice.reducer;