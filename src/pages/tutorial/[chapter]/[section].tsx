import Head from "next/head";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { FileSystemTree } from "@webcontainer/api";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import Tree from "@/components/file-explorer/Tree";
import { getCombinedFiles, getFileContentByPath } from "@/utils/objects";
import tutorials from "@/tutorials.json";
import { transformToWebcontainerFiles } from "@/utils/webcontainer";
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
const components = { CH };

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      {
        params: {
          chapter: "01-introduction",
          section: "01-smart-contracts",
        },
      },
      {
        params: {
          chapter: "01-introduction",
          section: "02-private-inputs",
        },
      },
    ],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  IHomeProps,
  TutorialParams
> = async ({ params }) => {
  const { chapter: c, section: s } = params!;

  const { name, test, tutorial, files, focusedFiles, testFiles, highlight } = (
    await import(`../../../json/${c}-${s}.json`)
  ).default;

  const webContainerFiles = await transformToWebcontainerFiles(
    `${process.cwd()}/tutorials/${c}/base`
  );

  return {
    props: {
      c,
      s,
      item: {
        tutorial,
        test,
        srcFiles: webContainerFiles,
        focusedFiles,
        highlight,
        testFiles,
        files,
      },
    },
  };
};

const Home: NextPage<IHomeProps> = ({ c, s, item }) => {
  const [tutorialItem, setTutorialItem] = useState(item);
  const [code, setCode] = useState<string | undefined>("");
  const webcontainerInstance = useAppSelector(selectWebcontainerInstance);
  const currentDirectory = useAppSelector(selectCurrentDirectory);
  const dispatch = useAppDispatch();

  const {
    tutorial,
    test,
    srcFiles,
    focusedFiles,
    files,
    testFiles,
    highlight,
  } = tutorialItem;

  const resetTerminalOutput = () => dispatch(setIsTestPassed(null));

  useEffect(() => {
    const fileCode = getFileContentByPath(highlight, focusedFiles);
    setCode(fileCode);
    dispatch(setCurrentTreeItem(highlight.replace(/\./g, "*")));
    resetTerminalOutput();
  }, [tutorialItem]);

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
        `node --experimental-vm-modules --experimental-wasm-threads node_modules/jest/bin/jest.js ${test} \r`
      )
    );
  };

  useEffect(() => {
    const fileSystemTree = getCombinedFiles(
      srcFiles,
      files,
      focusedFiles,
      testFiles
    );
    dispatch(initializeWebcontainer({ fileSystemTree, initTerminal: false }));
  }, []);

  const setItem = async (chapter: string, section: string) => {
    const { files, tutorial, focusedFiles, testFiles, test, highlight } = (
      await import(`../../../json/${chapter}-${section}.json`)
    ).default;
    setTutorialItem({
      ...tutorialItem,
      tutorial,
      focusedFiles,
      test,
      highlight,
    });
    const mountFiles = getCombinedFiles(
      srcFiles,
      files,
      focusedFiles,
      testFiles
    );
    await webcontainerInstance?.mount(mountFiles);
  };

  useEffect(() => {
    void setItem(c, s);
  }, [s, c]);

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
            <div className="px-4 pb-4 lg:h-[calc(100vh-120px)] overflow-y-auto">
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
    test: string;
    srcFiles: FileSystemTree;
    focusedFiles: FileSystemTree;
    highlight: string;
    testFiles: FileSystemTree;
    files: FileSystemTree;
  };
}

export default Home;
