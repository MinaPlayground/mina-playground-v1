import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import * as esbuild from "esbuild-wasm";

interface TranspilerState {
  initializingEsbuild: boolean;
  initializingEsbuildError: boolean;
}

const initialState: TranspilerState = {
  initializingEsbuild: false,
  initializingEsbuildError: false,
};

export const initializeEsbuild = createAsyncThunk(
  "initializeEsbuild",
  async () => {
    await esbuild.initialize({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.17.10/esbuild.wasm",
    });
  }
);

export const transpilerSlice = createSlice({
  name: "transpiler",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(initializeEsbuild.pending, (state, action) => {
        state.initializingEsbuild = true;
      })
      .addCase(initializeEsbuild.fulfilled, (state, action) => {
        state.initializingEsbuild = false;
      })
      .addCase(initializeEsbuild.rejected, (state, action) => {
        state.initializingEsbuild = false;
        state.initializingEsbuildError = true;
      });
  },
});

export const selectInitializingEsbuild = (state: RootState) =>
  state.transpiler.initializingEsbuild;

export default transpilerSlice.reducer;
