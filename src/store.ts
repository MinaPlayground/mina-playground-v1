import { configureStore } from "@reduxjs/toolkit";
import { fileTreeApi } from "@/services/fileTree";
import { projectApi } from "@/services/project";
import { setupListeners } from "@reduxjs/toolkit/query";
import webcontainerReducer from "@/features/webcontainer/webcontainerSlice";
import fileTreeReducer from "@/features/fileTree/fileTreeSlice";
import dockViewReducer from "@/features/dockView/dockViewSlice";

export const store = configureStore({
  reducer: {
    fileTree: fileTreeReducer,
    webcontainer: webcontainerReducer,
    dockView: dockViewReducer,
    [fileTreeApi.reducerPath]: fileTreeApi.reducer,
    [projectApi.reducerPath]: projectApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      fileTreeApi.middleware,
      projectApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
