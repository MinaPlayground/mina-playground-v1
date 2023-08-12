import { FC } from "react";
import TreeNode from "@/components/file-explorer/TreeNode";
import type { FileSystemTree } from "@webcontainer/api";
import {
  Directory,
  FileSystemOnBlurHandler,
  FileSystemOnChangeHandler,
  FileSystemOnClickHandler,
} from "@/types";

const Tree: FC<TreeType> = ({
  data,
  onBlur,
  onChange,
  onClick,
  directory = { path: "", webcontainerPath: "" },
  enableActions,
}) => {
  const sortedTree = Object.entries(data).sort(function (a, b) {
    const isADirectory = "directory" in a[1];
    const isBDirectory = "directory" in b[1];
    if (!isADirectory && isBDirectory) {
      return 1;
    }
    if (isADirectory && !isBDirectory) {
      return -1;
    }
    if (a[0] < b[0]) {
      return -1;
    }
    if (a[0] > b[0]) {
      return 1;
    }
    return 0;
  });
  return (
    <ul>
      {sortedTree.map((node) => {
        return enableActions ? (
          <TreeNode
            node={node}
            key={`${directory.path}/${node[0]}`}
            onBlur={onBlur}
            onChange={onChange}
            onClick={onClick}
            directory={directory}
            enableActions={enableActions}
          />
        ) : (
          <TreeNode
            node={node}
            key={`${directory.path}/${node[0]}`}
            onClick={onClick}
            directory={directory}
            enableActions={enableActions}
          />
        );
      })}
    </ul>
  );
};

interface TreeProps {
  data: FileSystemTree;
  onBlur?: never;
  onChange?: never;
  onClick: FileSystemOnClickHandler;
  directory?: Directory;
  enableActions: false;
}

interface TreePropsWithActions {
  data: FileSystemTree;
  onBlur: FileSystemOnBlurHandler;
  onChange: FileSystemOnChangeHandler;
  onClick: FileSystemOnClickHandler;
  directory?: Directory;
  enableActions: true;
}

type TreeType = TreeProps | TreePropsWithActions;

export default Tree;
