import { FC } from "react";
import SelectList from "@/components/select/SelectList";
import Loader from "@/components/Loader";
import TestSection from "@/components/test/TestSection";
import { FileNode, FileSystemTree } from "@webcontainer/api";
import { isEmpty } from "lodash";
import {
  selectInitializingEsbuild,
  writeCommand,
} from "@/features/webcontainer/webcontainerSlice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";

const getScripts = (fileSystemTree: FileSystemTree) => {
  if (!("package*json" in fileSystemTree)) return null;
  const parsedJSON = JSON.parse(
    (fileSystemTree["package*json"] as FileNode).file.contents as string
  );
  if (!("scripts" in parsedJSON) || isEmpty(parsedJSON.scripts)) return null;
  return parsedJSON.scripts;
};

const RunScript: FC<RunScriptProps> = ({ fileSystemTree }) => {
  const dispatch = useAppDispatch();
  const isInitializing = useAppSelector(selectInitializingEsbuild);

  const abortTest = async () => {
    dispatch(writeCommand("\u0003"));
  };

  const runTest = async () => {
    dispatch(
      writeCommand(
        "node --experimental-vm-modules --experimental-wasm-threads node_modules/jest/bin/jest.js test \r"
      )
    );
  };

  return (
    <>
      <SelectList
        title={"Choose a script"}
        items={getScripts(fileSystemTree)}
      />
      {isInitializing ? (
        <Loader
          text="Initializing Smart contract"
          circleColor={"text-black"}
          spinnerColor={"fill-orange-500"}
        />
      ) : (
        <TestSection
          isAborting={false}
          runTest={runTest}
          abortTest={abortTest}
        />
      )}
    </>
  );
};

interface RunScriptProps {
  fileSystemTree: FileSystemTree;
}

export default RunScript;
