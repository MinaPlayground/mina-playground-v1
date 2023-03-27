import { configureStore } from "@reduxjs/toolkit";
import transpilerReducer from "@/features/transpiler/transpilerSlice";

export const store = configureStore({
  reducer: {
    transpiler: transpilerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
