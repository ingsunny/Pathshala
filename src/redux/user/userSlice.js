import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  openSidebar: null,
  loading: false,
  sessionStatus: "loading",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.sessionStatus = "authenticated";
    },
    signInFailure: (state) => {
      state.loading = false;
    },
    logOut: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.sessionStatus = "anonymous";
    },
    sessionResolved: (state) => {
      state.sessionStatus = state.currentUser ? "authenticated" : "anonymous";
    },
    loadingState: (state, action) => {
      state.loading = action.payload;
    },
    openScreenSidebar: (state, action) => {
      state.openSidebar = action.payload;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  logOut,
  loadingState,
  openScreenSidebar,
  sessionResolved,
} = userSlice.actions;

export default userSlice.reducer;
