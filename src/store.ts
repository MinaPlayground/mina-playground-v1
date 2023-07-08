import { configureStore } from "@reduxjs/toolkit";
import { fileTreeApi } from "@/services/fileTree";
import { setupListeners } from "@reduxjs/toolkit/query";
import webcontainerReducer from "@/features/webcontainer/webcontainerSlice";

export const store = configureStore({
  reducer: {
    webcontainer: webcontainerReducer,
    [fileTreeApi.reducerPath]: fileTreeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      fileTreeApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
