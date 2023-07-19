import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import { DockviewApi } from "dockview-core";

interface DockViewState {
  dockApi: null | DockviewApi;
}

const initialState: DockViewState = {
  dockApi: null,
};

export const DockViewSlice = createSlice({
  name: "dockView",
  initialState,
  reducers: {
    setDockApi: (state, action) => {
      state.dockApi = action.payload;
    },
  },
});

export const selectDockApi = (state: RootState) => state.dockView.dockApi;

export const { setDockApi } = DockViewSlice.actions;

export default DockViewSlice.reducer;
