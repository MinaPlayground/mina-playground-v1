import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Header from "@/components/Header";
import { GetServerSideProps, NextPage } from "next";
import axios from "axios";
import { FileNode, FileSystemTree, WebContainer } from "@webcontainer/api";
import Tree from "@/components/file-explorer/Tree";
import { useEffect, useRef, useState } from "react";
import CodeEditor from "@/components/editor/CodeEditor";
import Loader from "@/components/Loader";
import TestSection from "@/components/test/TestSection";
import TerminalOutput from "@/components/terminal/TerminalOutput";
import SelectList from "@/components/select/SelectList";
import { isEmpty } from "lodash";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { projectId } = query;
  try {
    const responseProject = await axios.get(
      `http://localhost:3000/project/${projectId}`
    );
    const response = await axios.get(
      `http://localhost:3000/fileTree/${projectId}`
    );
    const { data } = response;
    return {
      props: { ...responseProject.data, ...data },
    };
  } catch {
    return {
      props: { data: null },
    };
  }
};

const Home: NextPage<HomeProps> = ({ fileSystemTree, name, _id }) => {
  const [directory, setDirectory] = useState({
    path: "",
    webcontainerPath: "",
  });
  const [code, setCode] = useState<string | undefined>("");
  const [isInitializing, setIsInitializing] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isAborting, setIsAborting] = useState(false);
  const webcontainerInstance = useRef<WebContainer | null>(null);
  const terminalInstance = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const shellRef = useRef<any>(null);
  const [terminalOutput, setTerminalOutput] = useState<boolean | null>(null);

  const [changedFields, setChangedFields] = useState({});

  const setCodeChange = async (code: string | undefined, dir?: string) => {
    if (!code) return;
    if (!dir) {
      setChangedFields({ ...changedFields, [directory.path]: code });
    }
    setCode(code);
  };

  const notSaved = directory.path in changedFields;

  const onClick = async (code: string, dir: string) => {
    setCodeChange(code, dir);
  };

  const save = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/fileTree/${_id}`,
        { fileLocation: directory.webcontainerPath, code },
        { headers: { "Content-Type": "application/json" } }
      );
    } catch {}
  };

  const installDependencies = async () => {
    if (!webcontainerInstance.current) return;
    const installProcess = await webcontainerInstance.current.spawn("npm", [
      "install",
    ]);
    installProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log(data);
        },
      })
    );
    return installProcess.exit;
  };

  const abortTest = async () => {
    setIsAborting(true);
    inputRef.current.write("\u0003");
    setTerminalOutput(null);
  };

  const runTest = async () => {
    setIsRunning(true);
    inputRef.current.write(
      `node --experimental-vm-modules --experimental-wasm-threads node_modules/jest/bin/jest.js test \r`
    );
  };

  const createProcess = async () => {
    if (!webcontainerInstance.current) return;
    const shellProcess = await webcontainerInstance.current.spawn("jsh");

    const input = shellProcess.input.getWriter();

    inputRef.current = input;
    shellRef.current = shellProcess;
    shellRef.current.output.pipeTo(
      new WritableStream({
        write(data) {
          if (data.endsWith("[3G")) {
            setIsRunning(false);
            setIsAborting(false);
          }
          if (data.includes("Tests")) {
            setTerminalOutput(!data.includes("failed"));
          }
        },
      })
    );
    return {
      input,
      shellProcess,
    };
  };

  const startWebContainer = async () => {
    const { WebContainer } = await import("@webcontainer/api");
    if (webcontainerInstance.current) return;
    webcontainerInstance.current = await WebContainer.boot();
    await webcontainerInstance.current.mount(fileSystemTree);

    const exitCode = await installDependencies();
    if (exitCode !== 0) {
      throw new Error("Installation failed");
    }

    await createProcess();
    setIsInitializing(false);
  };

  const initialize = async () => {
    setIsInitializing(true);
    await startWebContainer();
  };

  useEffect(() => {
    void initialize();
  }, []);

  useEffect(() => {
    if (isAborting || !terminalInstance.current) return;
    setTerminalOutput(null);
  }, [isAborting]);

  const getScripts = () => {
    if (!("package*json" in fileSystemTree)) return null;
    const parsedJSON = JSON.parse(
      (fileSystemTree["package*json"] as FileNode).file.contents as string
    );
    if (!("scripts" in parsedJSON) || isEmpty(parsedJSON.scripts)) return null;
    return parsedJSON.scripts;
  };

  return (
    <>
      <Head>
        <title>Mina Playground</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Header />
        <div className="flex flex-1">
          <div className="p-2 flex-1">
            <h1 className="text-2xl font-medium">Project: {name}</h1>
            <Tree
              data={fileSystemTree}
              onBlur={() => null}
              onClick={onClick}
              setCurrentDirectory={setDirectory}
              currentDirectory={directory}
            />
          </div>
          <div className="flex flex-col flex-[4]">
            <div className="ml-8 my-2 cursor-pointer" onClick={save}>
              {notSaved && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 448 512"
                >
                  <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V173.3c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32H64zm0 96c0-17.7 14.3-32 32-32H288c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V128zM224 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                </svg>
              )}
            </div>
            <CodeEditor code={code} setCodeChange={setCodeChange} />
          </div>
          <div className="flex flex-col flex-[2]">
            <div className="p-2">
              <SelectList title={"Choose a script"} items={getScripts()} />
              {isInitializing ? (
                <Loader
                  text="Initializing Smart contract"
                  circleColor={"text-black"}
                  spinnerColor={"fill-orange-500"}
                />
              ) : (
                <TestSection
                  isAborting={isAborting}
                  isRunning={isRunning}
                  runTest={runTest}
                  abortTest={abortTest}
                />
              )}
            </div>
            <div className="flex-1 bg-black">
              <TerminalOutput
                isRunning={isRunning}
                terminalOutput={terminalOutput}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

interface HomeProps {
  fileSystemTree: FileSystemTree;
  _id: string;
  name: string;
  type: number;
  visibility: boolean;
  files_id: number;
}

export default Home;
