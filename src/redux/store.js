import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./user/userSlice";
import courseSlice from "./course/courseSlice";

export const store = configureStore({
  reducer: { user: userSlice, courses: courseSlice },
});
