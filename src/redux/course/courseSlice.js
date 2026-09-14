import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courses: [],
};

const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    loadCourses: (state, action) => {
      state.courses = action.payload;
    },
  },
});

export const { loadCourses } = courseSlice.actions;

export default courseSlice.reducer;
