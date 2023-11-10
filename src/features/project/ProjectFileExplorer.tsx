import { FC, useState } from "react";
import Tree from "@/components/file-explorer/Tree";
import { produce } from "immer";
import { FileSystemTree } from "@webcontainer/api";
import {
  mutateFileTreeCreateNew,
  mutateFileTreeOnBlur,
} from "@/mutations/fileTreeMutations";
import { getCombinedPathName } from "@/utils/fileSystemWeb";
import { FileSystemOnBlurHandler, FileSystemOnChangeHandler } from "@/types";
import { mapFileSystemAction } from "@/mappers/mapFileSystemAction";
import {
  useDeleteFileTreeItemMutation,
  useUpdateFileTreeMutation,
} from "@/services/fileTree";
import { setCurrentTreeItem } from "@/features/fileTree/fileTreeSlice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  selectIsAborting,
  selectWebcontainerInstance,
} from "@/features/webcontainer/webcontainerSlice";
import { selectDockApi } from "@/features/dockView/dockViewSlice";

const ProjectFileExplorer: FC<ProjectFileExplorerProps> = ({
  fileSystemTree,
  id,
}) => {
  const dispatch = useAppDispatch();
  const [fileData, setFileData] = useState<FileSystemTree>(fileSystemTree);
  const [updateFileTree, { isLoading }] = useUpdateFileTreeMutation();
  const [deleteFileTreeItem, { isLoading: isLoadingDeletion }] =
    useDeleteFileTreeItemMutation();
  const webcontainerInstance = useAppSelector(selectWebcontainerInstance);
  const dockApi = useAppSelector(selectDockApi);

  const onClick = async (
    code: string,
    { path, webcontainerPath }: { path: string; webcontainerPath: string }
  ) => {
    dispatch(setCurrentTreeItem(path));

    const panel = dockApi?.getPanel(path);
    if (panel) {
      panel.api.setActive();
      return;
    }
    dockApi?.addPanel({
      id: path,
      title: path.replace(/\*/g, "."),
      component: "editor",
      params: { id, value: code, directory: { path, webcontainerPath } },
    });
  };

  const createNewFolder = () => {
    setFileData(
      produce((fileData: FileSystemTree) => {
        mutateFileTreeCreateNew(fileData, "directory");
      })
    );
  };

  const createNewFile = () => {
    setFileData(
      produce((fileData: FileSystemTree) => {
        mutateFileTreeCreateNew(fileData, "file");
      })
    );
  };

  const onChange: FileSystemOnChangeHandler = async (action, type, payload) => {
    const { path, value, directoryPath } = payload;
    setFileData(
      produce((fileData: FileSystemTree) => {
        mapFileSystemAction(action, type).action(fileData, payload);
      })
    );

    if (action === "delete") {
      const location = getCombinedPathName(payload.key, path, ".");
      try {
        const webcontainerPath = getCombinedPathName(
          value,
          directoryPath,
          "/"
        ).replace(/\*/g, ".");
        await deleteFileTreeItem({ id, body: { location } }).unwrap();
        await webcontainerInstance?.fs.rm(webcontainerPath, {
          recursive: true,
        });
      } catch {}
    }
  };

  const onBlur: FileSystemOnBlurHandler = async (action, type, payload) => {
    setFileData(
      produce((fileData) => {
        mutateFileTreeOnBlur(fileData, payload);
      })
    );

    if (action === "create") {
      const { value, fullPath, directoryPath } = payload;
      const webcontainerPath = getCombinedPathName(value, directoryPath, "/");
      const body = { location: fullPath };
      try {
        await updateFileTree({
          id,
          body,
        }).unwrap();
        type === "directory"
          ? webcontainerInstance?.fs.mkdir(webcontainerPath.replace(/\*/g, "."))
          : webcontainerInstance?.fs.writeFile(
              webcontainerPath.replace(/\*/g, "."),
              ""
            );
      } catch {}
    }

    if (action === "rename") {
      const { path, key, value, directoryPath } = payload;
      const body = {
        location: getCombinedPathName(key as string, path, "."),
        rename: getCombinedPathName(value, path, "."),
      };

      try {
        await updateFileTree({
          id,
          body,
        }).unwrap();
        const newPath = getCombinedPathName(value, directoryPath, "/");
        const oldPath = getCombinedPathName(key, directoryPath, "/");
        await webcontainerInstance?.spawn("mv", [
          "-t",
          newPath.replace(/\*/g, "."),
          oldPath.replace(/\*/g, "."),
        ]);
      } catch {}
    }
  };
  return (
    <div className="p-2">
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
      <Tree
        data={fileData}
        onBlur={onBlur}
        onChange={onChange}
        onClick={onClick}
        enableActions={true}
      />
    </div>
  );
};

interface ProjectFileExplorerProps {
  fileSystemTree: FileSystemTree;
  id: string;
}

export default ProjectFileExplorer;
