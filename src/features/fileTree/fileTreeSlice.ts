import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";

interface FileTreeState {
  currentTreeItem: {
    currentDirectory: { path: string; webcontainerPath: string };
    code: string;
  };
}

const initialState: FileTreeState = {
  currentTreeItem: {
    currentDirectory: { path: "", webcontainerPath: "" },
    code: "",
  },
};

export const FileTreeSlice = createSlice({
  name: "fileTree",
  initialState,
  reducers: {
    setCurrentTreeItem: (
      state,
      action: PayloadAction<{
        currentDirectory: { path: string; webcontainerPath: string };
        code: string;
      }>
    ) => {
      state.currentTreeItem = action.payload;
    },
  },
});

export const selectCurrentDirectory = (state: RootState) =>
  state.fileTree.currentTreeItem.currentDirectory;

export const selectCurrentTreeItem = (state: RootState) =>
  state.fileTree.currentTreeItem;

export const { setCurrentTreeItem } = FileTreeSlice.actions;

export default FileTreeSlice.reducer;
