import { FC, useState } from "react";
import Tree from "@/components/file-explorer/Tree";
import { normalizePath, pathToWebContainerPath } from "@/utils/fileSystemWeb";
import { FileSystemOnBlurHandler, FileSystemOnChangeHandler } from "@/types";
import {
  useDeleteFileTreeItemMutation,
  useUpdateFileTreeMutation,
} from "@/services/fileTree";
import {
  fileTreeCreateNew,
  fileTreeOnCreate,
  resetChangedFields,
  selectChangedFields,
  selectFileSystemTree,
  setChangedFieldStatus,
  setCurrentTreeItem,
} from "@/features/fileTree/fileTreeSlice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectWebcontainerInstance } from "@/features/webcontainer/webcontainerSlice";
import { selectDockApi } from "@/features/dockView/dockViewSlice";
import CommitButton from "@/components/version-control/CommitButton";
import SaveCode from "@/components/editor/SaveCode";
import Button from "@/components/button/Button";
import CreateProjectModal from "@/components/modal/CreateProjectModal";
import { useRouter } from "next/router";
import ResetCode from "@/components/editor/ResetCode";
import DownloadCode from "@/components/editor/DownloadCode";

const ProjectFileExplorer: FC<ProjectFileExplorerProps> = ({ id, name }) => {
  const dispatch = useAppDispatch();
  const fileData = useAppSelector(selectFileSystemTree);
  const { query } = useRouter();
  const { projectId } = query;
  const [updateFileTree, { isLoading, isSuccess, isError }] =
    useUpdateFileTreeMutation();
  const [deleteFileTreeItem, { isLoading: isLoadingDeletion }] =
    useDeleteFileTreeItemMutation();
  const webcontainerInstance = useAppSelector(selectWebcontainerInstance);
  const dockApi = useAppSelector(selectDockApi);
  const changedFields = useAppSelector(selectChangedFields);
  const [isForkModalVisible, setIsForkModalVisible] = useState(false);

  const onClick = async (code: string, path: string) => {
    dispatch(setCurrentTreeItem(path));

    const panel = dockApi?.getPanel(path);
    if (panel) {
      panel.api.setActive();
      return;
    }
    dockApi?.addPanel({
      id: path,
      title: normalizePath(path),
      component: "editor",
      params: { id, value: code, directory: path },
    });
  };

  const createNewFolder = () => dispatch(fileTreeCreateNew("directory"));
  const createNewFile = () => dispatch(fileTreeCreateNew("file"));

  const onChange: FileSystemOnChangeHandler = async (action, type, payload) => {
    const { path } = payload;
    if (action === "create") {
      const location = pathToWebContainerPath(path);
      dispatch(fileTreeOnCreate({ type, path: `${location}.directory` }));
    }

    if (action === "delete") {
      const location = pathToWebContainerPath(path);
      try {
        const webcontainerPath = normalizePath(path);
        await webcontainerInstance?.fs.rm(webcontainerPath, {
          recursive: true,
        });
        await deleteFileTreeItem({
          id,
          body: { location: location },
        }).unwrap();
      } catch {}
    }
  };

  const onBlur: FileSystemOnBlurHandler = async (action, type, payload) => {
    if (action === "create") {
      const { value } = payload;
      const path = pathToWebContainerPath(value);
      const webContainerPath = normalizePath(value);
      const body = {
        location:
          type === "directory" ? `${path}.directory` : `${path}.file.contents`,
      };
      try {
        await updateFileTree({
          id,
          body,
        }).unwrap();
        type === "directory"
          ? webcontainerInstance?.fs.mkdir(webContainerPath)
          : webcontainerInstance?.fs.writeFile(webContainerPath, "");
      } catch (e) {
        console.log(e);
      }
    }

    if (action === "rename") {
      const { path, value } = payload;
      const body = {
        location: pathToWebContainerPath(path),
        rename: pathToWebContainerPath(value),
      };
      try {
        await updateFileTree({
          id,
          body,
        }).unwrap();
        const newPath = normalizePath(value);
        const oldPath = normalizePath(path);
        await webcontainerInstance?.spawn("mv", ["-t", newPath, oldPath]);
      } catch {}
    }
  };

  const hasUnsavedField = Object.values(changedFields).some(
    ({ saved }) => !saved
  );

  const saveAllFields = async () => {
    try {
      const fieldValues: Record<string, string> = {};
      for (const key in changedFields) {
        fieldValues[
          `fileSystemTree.${pathToWebContainerPath(key)}.file.contents`
        ] = changedFields[key].currentCode;
      }
      await updateFileTree({
        id: id,
        body: { locations: fieldValues },
      }).unwrap();

      for (const key in changedFields) {
        dispatch(
          setChangedFieldStatus({
            location: key,
            saved: true,
          })
        );
        const { currentCode } = changedFields[key];
        const webContainerPath = normalizePath(key);
        webcontainerInstance?.fs.writeFile(webContainerPath, currentCode || "");
      }
    } catch {}
  };

  const resetAllFields = () => dispatch(resetChangedFields());

  return (
    <div className="p-2">
      <div className="mb-2">
        <SaveCode
          disabled={!hasUnsavedField}
          onClick={saveAllFields}
          isLoading={isLoading}
          isSaved={isSuccess && !hasUnsavedField}
          isError={isError}
          defaultText="Save all"
        />
        <ResetCode disabled={!hasUnsavedField} onClick={resetAllFields} />
        <DownloadCode />
        {/*<CommitButton />*/}
      </div>
      <div className="bg-gray-800 mb-2 p-2 text-gray-200">
        <div className="flex justify-between items-center">
          <h1 className="font-bold">{name}</h1>
          <Button
            isLoading={false}
            disabled={true}
            onClick={() => setIsForkModalVisible(true)}
            className="btn-primary btn-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              width="14"
              fill={"currentColor"}
              viewBox="0 0 448 512"
            >
              <path d="M80 104a24 24 0 1 0 0-48 24 24 0 1 0 0 48zm80-24c0 32.8-19.7 61-48 73.3V192c0 17.7 14.3 32 32 32H304c17.7 0 32-14.3 32-32V153.3C307.7 141 288 112.8 288 80c0-44.2 35.8-80 80-80s80 35.8 80 80c0 32.8-19.7 61-48 73.3V192c0 53-43 96-96 96H256v70.7c28.3 12.3 48 40.5 48 73.3c0 44.2-35.8 80-80 80s-80-35.8-80-80c0-32.8 19.7-61 48-73.3V288H144c-53 0-96-43-96-96V153.3C19.7 141 0 112.8 0 80C0 35.8 35.8 0 80 0s80 35.8 80 80zm208 24a24 24 0 1 0 0-48 24 24 0 1 0 0 48zM248 432a24 24 0 1 0 -48 0 24 24 0 1 0 48 0z" />
            </svg>
            Fork
          </Button>
        </div>
        <div className="flex items-center">
          <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2" />
          <span className="text-sm">Public</span>
        </div>
      </div>
      <div className="flex flex-row gap-1 mb-2">
        <svg
          onClick={createNewFile}
          height={16}
          width={16}
          className="cursor-pointer fill-gray-400 hover:fill-gray-200"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 576 512"
        >
          <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384v38.6C310.1 219.5 256 287.4 256 368c0 59.1 29.1 111.3 73.7 143.3c-3.2 .5-6.4 .7-9.7 .7H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zm48 96a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm16 80c0-8.8-7.2-16-16-16s-16 7.2-16 16v48H368c-8.8 0-16 7.2-16 16s7.2 16 16 16h48v48c0 8.8 7.2 16 16 16s16-7.2 16-16V384h48c8.8 0 16-7.2 16-16s-7.2-16-16-16H448V304z" />
        </svg>
        <svg
          onClick={createNewFolder}
          height={16}
          width={16}
          className="cursor-pointer fill-gray-400 hover:fill-gray-200"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M512 416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96C0 60.7 28.7 32 64 32H192c20.1 0 39.1 9.5 51.2 25.6l19.2 25.6c6 8.1 15.5 12.8 25.6 12.8H448c35.3 0 64 28.7 64 64V416zM232 376c0 13.3 10.7 24 24 24s24-10.7 24-24V312h64c13.3 0 24-10.7 24-24s-10.7-24-24-24H280V200c0-13.3-10.7-24-24-24s-24 10.7-24 24v64H168c-13.3 0-24 10.7-24 24s10.7 24 24 24h64v64z" />
        </svg>
      </div>
      {fileData && (
        <Tree
          data={fileData}
          onBlur={onBlur}
          onChange={onChange}
          onClick={onClick}
          enableActions={true}
        />
      )}
      <CreateProjectModal
        isVisible={isForkModalVisible}
        close={() => setIsForkModalVisible(false)}
        projectId={projectId as string}
      />
    </div>
  );
};

interface ProjectFileExplorerProps {
  id: string;
  name: string;
}

export default ProjectFileExplorer;
