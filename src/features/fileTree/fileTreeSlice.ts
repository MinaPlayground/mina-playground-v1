import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import { FileSystemTree } from "@webcontainer/api";
import { fileTreeApi } from "@/services/fileTree";
import { FileSystemType } from "@/types";
import { getFileSystemValueByType } from "@/utils/fileSystemWeb";
import { get, merge } from "lodash";
import { versionControlApi } from "@/services/versionControl";
import { setIsRunning } from "@/features/webcontainer/webcontainerSlice";

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

export const updateFileSystemTree = createAsyncThunk(
  "updateFileSystemTree",
  async (
    { path, type }: { path: string; type: "file" | "directory" },
    { getState, dispatch }
  ) => {
    const { webcontainer, fileTree } = getState();
    const parts = path.split("/");
    let result = {};
    for (let i = parts.length - 1; i >= 0; i--) {
      if (i === parts.length - 1) {
        let temp = {};
        let fileName = parts[i];
        if (type === "file") {
          const contents = await webcontainer.webcontainerInstance.fs.readFile(
            path,
            "utf-8"
          );
          temp[fileName] = {
            file: { contents },
          };
        } else {
          temp[fileName] = { directory: {} };
        }
        result = temp;
      } else {
        let temp = {};
        temp[parts[i]] = { directory: result };
        result = temp;
      }
      const newFileSystemTree = merge({}, fileTree.fileSystemTree, result);
      dispatch(setFileSystemTree(newFileSystemTree));
    }
  }
);

export const FileTreeSlice = createSlice({
  name: "fileTree",
  initialState,
  reducers: {
    setFileSystemTree: (state, action: PayloadAction<FileSystemTree>) => {
      state.fileSystemTree = action.payload;
    },
    // updateFileSystemTree: (
    //   state,
    //   action: PayloadAction<{ path: string; type: "file" | "directory" }>
    // ) => {
    // const { path, type } = action.payload;
    // const parts = path.split("/");
    // let result = {};
    // for (let i = parts.length - 1; i >= 0; i--) {
    //   if (i === parts.length - 1) {
    //     let temp = {};
    //     let fileName = parts[i];
    //     if (type === "file") {
    //       const contents = (state.temp[fileName] = {
    //         file: { contents: "test" },
    //       });
    //     }
    //     temp[fileName] =
    //       type === "file"
    //         ? { file: { contents: "test" } }
    //         : { directory: {} };
    //     result = temp;
    //   } else {
    //     let temp = {};
    //     temp[parts[i]] = { directory: result };
    //     result = temp;
    //   }
    //   }
    //   state.fileSystemTree = merge({}, state.fileSystemTree, result);
    // },
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
    deleteChangedField: (
      state,
      action: PayloadAction<{ location: string }>
    ) => {
      const { location } = action.payload;
      if (!(location in state.changedFields)) return;
      delete state.changedFields[location];
    },
    resetChangedFields: (state) => {
      state.changedFields = {};
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
  resetChangedFields,
  deleteChangedField,
  setFileSystemTree,
  fileTreeCreateNew,
  fileTreeOnCreate,
} = FileTreeSlice.actions;

export default FileTreeSlice.reducer;
