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
import { getTutorialByChapterAndSection } from "@/utils/tutorial";
import { transformToWebcontainerFiles } from "@/utils/webcontainer";
import { isValidChapterAndSection } from "@/utils/validation";
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
import { setCurrentTreeItem } from "@/features/fileTree/fileTreeSlice";
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
  const isValid = isValidChapterAndSection(c as string, s as string);
  if (!isValid) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { name, test, tutorial, files, focusedFiles, testFiles, highlight } =
    await getTutorialByChapterAndSection(c as string, s as string);

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

  useEffect(() => {
    const fileCode = getFileContentByPath(highlight, focusedFiles);
    setCode(fileCode);
    // setCurrentDirectory(highlight);
    resetTerminalOutput();
  }, [tutorialItem]);

  const [code, setCode] = useState<string | undefined>("");
  const webcontainerInstance = useAppSelector(selectWebcontainerInstance);
  const [chapter, setChapter] = useState(c);
  const [section, setSection] = useState(s);
  const [currentDirectory, setCurrentDirectory] = useState("");

  const resetTerminalOutput = () => dispatch(setIsTestPassed(null));

  const onClick = (
    code: string,
    { path, webcontainerPath }: { path: string; webcontainerPath: string }
  ) => {
    dispatch(
      setCurrentTreeItem({
        currentDirectory: { path, webcontainerPath },
        code: code as string,
      })
    );
    setCodeChange(code, path);
  };

  const setCodeChange = (code: string | undefined, dir?: string) => {
    if (!code) return;
    setCode(code);
    webcontainerInstance?.fs.writeFile(
      `/src/${dir ?? currentDirectory}`.replaceAll(/\*/g, "."),
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

    let keysPressed: Record<string, any> = {};

    const onKeydown = (event: KeyboardEvent) => {
      keysPressed[event.key] = true;

      if (keysPressed["Control"] && event.key == "s") {
        runTest();
      }
    };

    const onKeyup = (event: KeyboardEvent) => {
      delete keysPressed[event.key];
    };

    document.addEventListener("keydown", onKeydown);
    document.addEventListener("keyup", onKeyup);
    return () => {
      document.removeEventListener("keydown", onKeydown);
      document.removeEventListener("keyup", onKeyup);
    };
  }, []);

  const onSetSection = async (section: string) => {
    setSection(section);
    setCode("");
    setCurrentDirectory("");
    const { files, tutorial, focusedFiles, testFiles, test, highlight } = (
      await import(`../../../../tutorials/json/${section}.json`)
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
            <Breadcrumb
              chapterIndex={chapter}
              sectionIndex={section}
              setChapter={setChapter}
              setSection={onSetSection}
              items={tutorials}
            />
            <div className="px-4 pb-4 lg:h-[calc(100vh-120px)] overflow-y-auto">
              <div id="tutorial">
                <MDXRemote {...tutorial} components={components} />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-1 border-b-2 flex-row">
              <Tree
                data={focusedFiles}
                onClick={onClick}
                enableActions={false}
              />
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
