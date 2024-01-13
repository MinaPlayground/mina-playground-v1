import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import { FileSystemTree } from "@webcontainer/api";
import { fileTreeApi } from "@/services/fileTree";
import { FileSystemType } from "@/types";
import { getFileSystemValueByType } from "@/utils/fileSystemWeb";
import { get } from "lodash";
import { versionControlApi } from "@/services/versionControl";

interface FileTreeState {
  currentTreeItem: string;
  changedFields: Record<
    string,
    {
      previousCode: string;
      currentCode: string;
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
    fileTreeOnCreate: (
      state,
      action: PayloadAction<{ type: FileSystemType; path: string }>
    ) => {
      const { type, path } = action.payload;
      if (!state.fileSystemTree) return;
      const fileSystemValue = getFileSystemValueByType(type);
      const data = get(state.fileSystemTree, path) as Record<string, any>;
      data[""] = fileSystemValue;
    },
    setCurrentTreeItem: (state, action: PayloadAction<string>) => {
      state.currentTreeItem = action.payload;
    },
    setChangedFields: (
      state,
      action: PayloadAction<{
        location: string;
        previousCode: string;
        currentCode: string;
      }>
    ) => {
      const { location, previousCode, currentCode } = action.payload;
      state.changedFields = {
        ...state.changedFields,
        [location]: { previousCode, currentCode, saved: false },
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
      )
      .addMatcher(
        versionControlApi.endpoints.createCommit.matchFulfilled,
        (state, action) => {
          for (const key in state.changedFields) {
            const field = state.changedFields[key];
            if (field.saved) {
              delete state.changedFields[key];
            }
          }
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
  fileTreeOnCreate,
} = FileTreeSlice.actions;

export default FileTreeSlice.reducer;
