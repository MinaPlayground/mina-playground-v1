import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import { FileSystemTree, WebContainer } from "@webcontainer/api";

interface WebcontainerState {
  initializingWebcontainer: boolean;
  initializingWebcontainerError: string | null;
  webcontainerInstance: WebContainer | null;
  shellProcessInput: WritableStreamDefaultWriter | null;

  isRunning: boolean;
  isAborting: boolean;
  isTestPassed: boolean | null;
  isDeploying: boolean;
  deploymentMessage: {
    type: "info" | "error";
    message: string;
    details?: string;
  } | null;
  serverUrl: string | null;
}

const initialState: WebcontainerState = {
  initializingWebcontainer: true,
  initializingWebcontainerError: null,
  webcontainerInstance: null,
  shellProcessInput: null,
  isRunning: false,
  isAborting: false,
  isTestPassed: null,
  isDeploying: false,
  deploymentMessage: null,
  serverUrl: null,
};

export const initializeWebcontainer = createAsyncThunk(
  "initializeWebcontainer",
  async (
    {
      fileSystemTree,
      initTerminal = true,
    }: { fileSystemTree: FileSystemTree; initTerminal?: boolean },
    { dispatch }
  ) => {
    if (initTerminal) {
      const { FitAddon } = await import("xterm-addon-fit");
      const fitAddon = new FitAddon();
      const { Terminal } = await import("xterm");
      const terminalEl = document.querySelector(".terminal");
      const terminal = new Terminal({
        convertEol: true,
      });
      terminal.loadAddon(fitAddon);
      terminal.open(<HTMLElement>terminalEl);
      fitAddon.fit();

      const { WebContainer } = await import("@webcontainer/api");
      const webcontainer = await WebContainer.boot();
      await webcontainer.mount(fileSystemTree);

      webcontainer.on("server-ready", (port, url) => {
        dispatch(setServerUrl(url));
      });

      const installProcess = await webcontainer.spawn("npm", ["install"]);
      installProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            terminal.write(data);
          },
        })
      );

      if ((await installProcess.exit) !== 0) {
        throw new Error("Installation failed");
      }

      const shellProcess = await webcontainer.spawn("jsh", {
        terminal: {
          cols: terminal.cols,
          rows: terminal.rows,
        },
      });

      const xterm_resize_ob = new ResizeObserver(function (entries) {
        fitAddon.fit();
        shellProcess.resize({
          cols: terminal.cols,
          rows: terminal.rows,
        });
      });
      xterm_resize_ob.observe(<HTMLElement>terminalEl);

      const input = shellProcess.input.getWriter();

      terminal.onData((data) => {
        input.write(data);
      });

      shellProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            terminal.write(data);
            if (data === "^C") {
              dispatch(setIsAborting(true));
            }
            if (data.endsWith("[3G")) {
              dispatch(setIsRunning(false));
              dispatch(setIsAborting(false));
            }
          },
        })
      );
      return { webcontainer, input };
    }

    const { WebContainer } = await import("@webcontainer/api");
    const webcontainer = await WebContainer.boot();
    await webcontainer.mount(fileSystemTree);

    const installProcess = await webcontainer.spawn("npm", ["install"]);
    if ((await installProcess.exit) !== 0) {
      throw new Error("Installation failed");
    }

    const shellProcess = await webcontainer.spawn("jsh");
    const input = shellProcess.input.getWriter();

    shellProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          if (data === "^C") {
            dispatch(setIsAborting(true));
          }
          if (data.endsWith("[3G")) {
            dispatch(setIsRunning(false));
            dispatch(setIsAborting(false));
          }
          if (data.includes("Tests")) {
            dispatch(setIsTestPassed(!data.includes("failed")));
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

export const deploySmartContract = createAsyncThunk(
  "deploySmartContract",
  async (
    { path, feePayerKey }: { path: string; feePayerKey: string },
    { getState, dispatch }
  ) => {
    dispatch(setIsDeploying(true));
    dispatch(setDeploymentMessage(null));
    const { webcontainer } = getState() as { webcontainer: WebcontainerState };
    const process = await webcontainer?.webcontainerInstance?.spawn("npm", [
      "run",
      "build",
    ]);
    await process?.exit;

    const process2 = await webcontainer?.webcontainerInstance?.spawn("npx", [
      "--yes",
      "easy-mina-deploy",
      "deploy",
      "--path",
      path,
      "--className",
      "Add",
      "--feePayerKey",
      feePayerKey,
    ]);

    process2?.output.pipeTo(
      new WritableStream({
        write(data) {
          if (data.startsWith("{")) {
            dispatch(setDeploymentMessage(JSON.parse(data)));
          }
        },
      })
    );

    await process2?.exit;
    dispatch(setIsDeploying(false));
  }
);

export const webcontainerSlice = createSlice({
  name: "webcontainer",
  initialState,
  reducers: {
    setIsRunning: (state, action: PayloadAction<boolean>) => {
      state.isRunning = action.payload;
    },
    setIsAborting: (state, action: PayloadAction<boolean>) => {
      state.isAborting = action.payload;
    },
    setIsTestPassed: (state, action: PayloadAction<boolean | null>) => {
      state.isTestPassed = action.payload;
    },
    setIsDeploying: (state, action: PayloadAction<boolean>) => {
      state.isDeploying = action.payload;
    },
    setDeploymentMessage: (state, action: PayloadAction<any>) => {
      state.deploymentMessage = action.payload;
    },
    setServerUrl: (state, action: PayloadAction<any>) => {
      state.serverUrl = action.payload;
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
        state.initializingWebcontainerError =
          action.error.message ?? "An unexpected error has occurred";
      });
    //TODO add reject case for write command
  },
});

export const selectInitializingEsbuild = (state: RootState) =>
  state.webcontainer.initializingWebcontainer;

export const selectInitializingWebContainerError = (state: RootState) =>
  state.webcontainer.initializingWebcontainerError;

export const selectWebcontainerInstance = (state: RootState) =>
  state.webcontainer.webcontainerInstance;

export const selectIsRunning = (state: RootState) =>
  state.webcontainer.isRunning;

export const selectIsAborting = (state: RootState) =>
  state.webcontainer.isAborting;

export const selectIsTestPassed = (state: RootState) =>
  state.webcontainer.isTestPassed;

export const selectIsDeploying = (state: RootState) =>
  state.webcontainer.isDeploying;

export const selectDeploymentMessage = (state: RootState) =>
  state.webcontainer.deploymentMessage;

export const selectServerUrl = (state: RootState) =>
  state.webcontainer.serverUrl;

export const {
  setIsRunning,
  setIsAborting,
  setIsDeploying,
  setDeploymentMessage,
  setIsTestPassed,
  setServerUrl,
} = webcontainerSlice.actions;
export default webcontainerSlice.reducer;
