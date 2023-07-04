import { configureStore } from "@reduxjs/toolkit";
import fileTreeReducer from "@/features/filetree/fileTreeSlice";
import { fileTreeApi } from "@/services/fileTree";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    fileTree: fileTreeReducer,
    [fileTreeApi.reducerPath]: fileTreeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(fileTreeApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
