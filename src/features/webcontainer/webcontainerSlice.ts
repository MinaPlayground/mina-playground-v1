import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import { FileSystemTree, WebContainer } from "@webcontainer/api";

interface WebcontainerState {
  initializingWebcontainer: boolean;
  initializingWebcontainerError: boolean;
  webcontainerInstance: WebContainer | null;
  shellProcessInput: WritableStreamDefaultWriter | null;
  isRunning: boolean;
}

const initialState: WebcontainerState = {
  initializingWebcontainer: false,
  initializingWebcontainerError: false,
  webcontainerInstance: null,
  shellProcessInput: null,
  isRunning: false,
};

export const initializeWebcontainer = createAsyncThunk(
  "initializeWebcontainer",
  async (
    { fileSystemTree }: { fileSystemTree: FileSystemTree },
    { dispatch }
  ) => {
    const { WebContainer } = await import("@webcontainer/api");
    const webcontainer = await WebContainer.boot();
    webcontainer.mount(fileSystemTree);

    const installProcess = await webcontainer.spawn("npm", ["install"]);
    installProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log(data);
        },
      })
    );

    if ((await installProcess.exit) !== 0) {
      throw new Error("Installation failed");
    }

    const shellProcess = await webcontainer.spawn("jsh");
    // save shellProcess, keep output stream in component
    const input = shellProcess.input.getWriter();
    shellProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log(data);
          if (data.endsWith("[3G")) {
            dispatch(setIsRunning(false));
            // setIsRunning(false);
            // setIsAborting(false);
          }
          if (data.includes("Tests")) {
            // setTerminalOutput(!data.includes("failed"));
          }
        },
      })
    );

    return { webcontainer, input };
  }
);

export const writeCommand = createAsyncThunk(
  "writeCommand",
  async (command: string, { getState, dispatch }) => {
    dispatch(setIsRunning(true));
    const { webcontainer } = getState() as { webcontainer: WebcontainerState };
    await webcontainer.shellProcessInput?.write(command);
  }
);

export const webcontainerSlice = createSlice({
  name: "webcontainer",
  initialState,
  reducers: {
    setIsRunning: (state, action: PayloadAction<boolean>) => {
      state.isRunning = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(initializeWebcontainer.pending, (state, action) => {
        state.initializingWebcontainer = true;
      })
      .addCase(initializeWebcontainer.fulfilled, (state, action) => {
        state.initializingWebcontainer = false;
        state.webcontainerInstance = action.payload.webcontainer;
        state.shellProcessInput = action.payload.input;
      })
      .addCase(initializeWebcontainer.rejected, (state, action) => {
        state.initializingWebcontainer = false;
        state.initializingWebcontainerError = true;
      });

    // add reject case for write command
  },
});

export const selectInitializingEsbuild = (state: RootState) =>
  state.webcontainer.initializingWebcontainer;

export const selectWebcontainerInstance = (state: RootState) =>
  state.webcontainer.webcontainerInstance;

export const selectShellProcessInput = (state: RootState) =>
  state.webcontainer.shellProcessInput;

export const selectIsRunning = (state: RootState) =>
  state.webcontainer.isRunning;

export const { setIsRunning } = webcontainerSlice.actions;
export default webcontainerSlice.reducer;
