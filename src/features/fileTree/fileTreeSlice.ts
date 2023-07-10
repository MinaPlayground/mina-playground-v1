import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";

interface FileTreeState {
  currentTreeItem: {
    currentDirectory: { path: string; webcontainerPath: string };
    code: string;
  };
  changedFields: Record<string, string>;
}

const initialState: FileTreeState = {
  currentTreeItem: {
    currentDirectory: { path: "", webcontainerPath: "" },
    code: "",
  },
  changedFields: {},
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
    setChangedFields: (
      state,
      action: PayloadAction<Record<string, string>>
    ) => {
      state.changedFields = { ...state.changedFields, ...action.payload };
    },
    deleteFromChangedFields: (state, action: PayloadAction<string>) => {
      if (!(action.payload in state.changedFields)) return;
      delete state.changedFields[action.payload];
    },
  },
});

export const selectCurrentDirectory = (state: RootState) =>
  state.fileTree.currentTreeItem.currentDirectory;

export const selectCurrentTreeItem = (state: RootState) =>
  state.fileTree.currentTreeItem;

export const selectChangedFields = (state: RootState) =>
  state.fileTree.changedFields;

export const { setCurrentTreeItem, setChangedFields, deleteFromChangedFields } =
  FileTreeSlice.actions;

export default FileTreeSlice.reducer;
