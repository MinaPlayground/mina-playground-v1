import Head from "next/head";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { FileSystemTree } from "@webcontainer/api";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import Tree from "@/components/file-explorer/Tree";
import tutorials from "@/tutorials.json";
import { TutorialParams } from "@/types";
import { CH } from "@code-hike/mdx/components";
import CodeEditor from "@/components/editor/CodeEditor";
import TerminalOutput from "@/components/terminal/TerminalOutput";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  initializeWebcontainer,
  selectWebcontainerInstance,
  setIsTestPassed,
  writeCommand,
} from "@/features/webcontainer/webcontainerSlice";
import RunScriptButton from "@/components/terminal/RunScriptButton";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  selectCurrentDirectory,
  setCurrentTreeItem,
} from "@/features/fileTree/fileTreeSlice";
import tutorialsPath from "@/tutorialPaths.json";
const components = { CH };

export const getStaticPaths: GetStaticPaths = async () => {
  return tutorialsPath;
};

export const getStaticProps: GetStaticProps<
  IHomeProps,
  TutorialParams
> = async ({ params }) => {
  const { chapter: c, section: s } = params!;

  const { tutorial, files, focusedFiles, highlightedItem } = (
    await import(`../../../json/${c}-${s}.json`)
  ).default;

  return {
    props: {
      c,
      s,
      item: {
        tutorial,
        focusedFiles,
        highlightedItem,
        files,
      },
    },
  };
};

const Home: NextPage<IHomeProps> = ({ c, s, item }) => {
  const { tutorial, focusedFiles, files, highlightedItem } = item;
  const { highlightedName, highlightedCode } = highlightedItem;

  const [code, setCode] = useState<string | undefined>(highlightedCode);
  const webcontainerInstance = useAppSelector(selectWebcontainerInstance);
  const currentDirectory = useAppSelector(selectCurrentDirectory);
  const dispatch = useAppDispatch();

  const resetTerminalOutput = () => dispatch(setIsTestPassed(null));

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

  useEffect(() => {
    resetTerminalOutput();
    dispatch(
      initializeWebcontainer({ fileSystemTree: files, initTerminal: false })
    );
    dispatch(setCurrentTreeItem(highlightedName));
  }, []);

  return (
    <>
      <Head>
        <title>Mina Playground</title>
        <meta
          name="description"
          content="Interactive Smart Contracts tutorial"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" />
      </Head>
      <main>
        <Header />
        <div className="flex flex-1 grid lg:grid-cols-2">
          <div className="min-w-0">
            <Breadcrumb chapterIndex={c} sectionIndex={s} items={tutorials} />
            <div className="px-4 pb-4 lg:h-[calc(100vh-125px)] overflow-y-auto">
              <div id="tutorial">
                <MDXRemote {...tutorial} components={components} />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-1 border-b-2 flex-row">
              <div className="w-40 p-4">
                <Tree
                  data={focusedFiles}
                  onClick={onClick}
                  enableActions={false}
                />
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
          </div>
        </div>
      </main>
    </>
  );
};

interface IHomeProps {
  c: string;
  s: string;
  item: {
    tutorial: MDXRemoteSerializeResult;
    focusedFiles: FileSystemTree;
    highlightedItem: {
      highlightedName: string;
      highlightedCode: string;
    };
    files: FileSystemTree;
  };
}

export default Home;
