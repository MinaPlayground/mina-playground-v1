import { FC, useEffect, useState } from "react";
import Tree from "@/components/file-explorer/Tree";
import CodeEditor from "@/components/editor/CodeEditor";
import RunScriptButton from "@/components/terminal/RunScriptButton";
import TerminalOutput from "@/components/terminal/TerminalOutput";
import {
  initializeWebcontainer,
  selectWebcontainerInstance,
  setIsTestPassed,
  writeCommand,
} from "@/features/webcontainer/webcontainerSlice";
import {
  selectCurrentDirectory,
  setCurrentTreeItem,
} from "@/features/fileTree/fileTreeSlice";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { FileSystemTree } from "@webcontainer/api";

// TODO make dynamic to support unit/playground type
const Unit: FC<UnitProps> = ({ files, focusedFiles, highlightedItem }) => {
  const { highlightedName, highlightedCode } = highlightedItem;
  const [code, setCode] = useState<string | undefined>(highlightedCode);
  const webcontainerInstance = useAppSelector(selectWebcontainerInstance);
  const currentDirectory = useAppSelector(selectCurrentDirectory);
  const dispatch = useAppDispatch();

  const resetTerminalOutput = () => dispatch(setIsTestPassed(null));

  useEffect(() => {
    resetTerminalOutput();
    dispatch(
      initializeWebcontainer({ fileSystemTree: files, initTerminal: false })
    );
    dispatch(setCurrentTreeItem(highlightedName));
  }, []);

  const onClick = (code: string, { path }: { path: string }) => {
    dispatch(setCurrentTreeItem(path));
    setCodeChange(code, path);
  };

  const setCodeChange = (code: string | undefined, dir?: string) => {
    if (!code) return;
    setCode(code);
    webcontainerInstance?.fs.writeFile(
      `/src/${dir ?? currentDirectory}`.replace(/\*/g, "."),
      code
    );
  };

  const abortTest = async () => {
    dispatch(writeCommand("\u0003"));
    resetTerminalOutput();
  };

  const runTest = async () => {
    dispatch(
      writeCommand(
        `node --experimental-vm-modules --experimental-wasm-threads node_modules/jest/bin/jest.js \r`
      )
    );
  };

  return (
    <>
      <div className="flex flex-1 border-b-2 flex-row">
        <div className="w-40 p-4">
          <Tree data={focusedFiles} onClick={onClick} enableActions={false} />
        </div>
        <CodeEditor code={code} setCodeChange={setCodeChange} />
      </div>
      <div>
        <div className="p-2">
          <RunScriptButton
            onRun={runTest}
            abortTitle={"Abort"}
            onAbort={abortTest}
            runTitle={"Run"}
          />
        </div>
        <TerminalOutput />
      </div>
    </>
  );
};

interface UnitProps {
  highlightedItem: {
    highlightedName: string;
    highlightedCode: string;
  };
  files: FileSystemTree;
  focusedFiles: FileSystemTree;
}

export default Unit;
