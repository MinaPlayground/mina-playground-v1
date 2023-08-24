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
  setChangedFields,
  setCurrentTreeItem,
} from "@/features/fileTree/fileTreeSlice";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { FileSystemTree } from "@webcontainer/api";
import * as React from "react";

const InteractiveTutorial: FC<InteractiveTutorialProps> = ({
  type,
  files,
  focusedFiles,
  highlightedItem,
}) => {
  const { highlightedName, highlightedCode } = highlightedItem;
  const [code, setCode] = useState<string | undefined>(highlightedCode);
  const webcontainerInstance = useAppSelector(selectWebcontainerInstance);
  const currentDirectory = useAppSelector(selectCurrentDirectory);
  const dispatch = useAppDispatch();

  const resetTerminalOutput = () => dispatch(setIsTestPassed(null));

  const { initTerminal } =
    type === "unit"
      ? {
          initTerminal: false,
        }
      : {
          initTerminal: true,
        };

  useEffect(() => {
    resetTerminalOutput();
    dispatch(initializeWebcontainer({ fileSystemTree: files, initTerminal }));
    dispatch(setCurrentTreeItem(highlightedName));
  }, []);

  const onClick = (code: string, path: string) => {
    setCode(code);
  };

  const onCodeChange = (value: string | undefined) => {
    const code = value || "";
    setCode(code);
    webcontainerInstance?.fs.writeFile(
      `/src/${currentDirectory}`.replace(/\*/g, "."),
      code
    );
    dispatch(setChangedFields({ location: currentDirectory, code }));
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
        <CodeEditor code={code} setCodeChange={onCodeChange} />
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
        {initTerminal ? (
          <div className="terminal h-[150px] bg-black" />
        ) : (
          <TerminalOutput />
        )}
      </div>
    </>
  );
};

interface InteractiveTutorialProps {
  type: "unit" | "playground";
  highlightedItem: {
    highlightedName: string;
    highlightedCode: string;
  };
  files: FileSystemTree;
  focusedFiles: FileSystemTree;
}

export default InteractiveTutorial;
