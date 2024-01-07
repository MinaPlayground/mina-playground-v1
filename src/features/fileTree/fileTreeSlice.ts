import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import { FileSystemTree } from "@webcontainer/api";
import { fileTreeApi } from "@/services/fileTree";
import { FileSystemType } from "@/types";
import { getFileSystemValueByType } from "@/utils/fileSystemWeb";

interface FileTreeState {
  currentTreeItem: string;
  changedFields: Record<
    string,
    {
      code: string;
      saved: boolean;
    }
  >;
  fileSystemTree: FileSystemTree | null;
}

const initialState: FileTreeState = {
  currentTreeItem: "",
  changedFields: {},
  fileSystemTree: null,
};

export const FileTreeSlice = createSlice({
  name: "fileTree",
  initialState,
  reducers: {
    setFileSystemTree: (state, action: PayloadAction<FileSystemTree>) => {
      state.fileSystemTree = action.payload;
    },
    fileTreeCreateNew: (state, action: PayloadAction<FileSystemType>) => {
      if (!state.fileSystemTree) return;
      state.fileSystemTree[""] = getFileSystemValueByType(action.payload);
    },
    setCurrentTreeItem: (state, action: PayloadAction<string>) => {
      state.currentTreeItem = action.payload;
    },
    setChangedFields: (
      state,
      action: PayloadAction<{ location: string; code: string }>
    ) => {
      const { location, code } = action.payload;
      state.changedFields = {
        ...state.changedFields,
        [location]: { code, saved: false },
      };
    },
    setChangedFieldStatus: (
      state,
      action: PayloadAction<{ location: string; saved: boolean }>
    ) => {
      const { location, saved } = action.payload;
      if (!(location in state.changedFields)) return;
      state.changedFields[location].saved = saved;
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(
        fileTreeApi.endpoints.deleteFileTreeItem.matchFulfilled,
        (state, action) => {
          state.fileSystemTree = action.payload.fileSystemTree;
        }
      )
      .addMatcher(
        fileTreeApi.endpoints.updateFileTree.matchFulfilled,
        (state, action) => {
          state.fileSystemTree = action.payload.fileSystemTree;
        }
      );
  },
});

export const selectCurrentDirectory = (state: RootState) =>
  state.fileTree.currentTreeItem;

export const selectFileSystemTree = (state: RootState) =>
  state.fileTree.fileSystemTree;

export const selectChangedFields = (state: RootState) =>
  state.fileTree.changedFields;

export const selectChangedField = (state: RootState, fieldName: string) =>
  state.fileTree.changedFields[fieldName];

export const {
  setCurrentTreeItem,
  setChangedFields,
  setChangedFieldStatus,
  setFileSystemTree,
  fileTreeCreateNew,
} = FileTreeSlice.actions;

export default FileTreeSlice.reducer;
