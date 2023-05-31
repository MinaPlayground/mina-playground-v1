import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Header from "@/components/Header";
import Editor from "@monaco-editor/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getWorker,
  MonacoJsxSyntaxHighlight,
} from "monaco-jsx-syntax-highlight";
import Loader from "@/components/Loader";
import { WebContainer } from "@webcontainer/api";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import type { GetServerSideProps } from "next";
import { MDXRemote } from "next-mdx-remote";
import axios from "axios";
import Tree from "@/components/file-explorer/Tree";
import { getCombinedFiles } from "@/utils/objects";
import tutorials from "@/tutorials.json";

const finalCodeBlock = `
import { Field, SmartContract, state, State, method } from "snarkyjs";

/**
 * Basic Example
 * See https://docs.minaprotocol.com/zkapps for more info.
 *
 * The Add contract initializes the state variable 'num' to be a Field(1) value by default when deployed.
 * When the 'update' method is called, the Add contract adds Field(2) to its 'num' contract state.
 *
 * This file is safe to delete and replace with your own contract.
 */
export class Add extends SmartContract {
  @state(Field) num = State<Field>();

  init() {
    super.init();
    this.num.set(Field(1));
  }

  @method update() {
    const currentState = this.num.getAndAssertEquals();
    const newState = currentState.add(2);
    this.num.set(newState);
  }
}
`;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const { c, s } = query;
  const { name, test, tutorial, files, focusedFiles, testFiles } = (
    await axios.post(
      "http://localhost:3000/api/sectionFiles",
      { chapter: c, section: s },
      { headers: { "Content-Type": "application/json" } }
    )
  ).data;

  const webContainerFiles = await axios.post(
    "http://localhost:3000/api/webcontainerFiles",
    { chapter: c },
    { headers: { "Content-Type": "application/json" } }
  );

  return {
    props: {
      c,
      s,
      item: {
        tutorial,
        test,
        srcFiles: webContainerFiles.data.files,
        focusedFiles,
        testFiles,
        files,
      },
    },
  };
};

const Home = ({ c, s, item }: { c: string; s: string; item: any }) => {
  const [tutorialItem, setTutorialItem] = useState<{
    tutorial: any;
    test: string;
    srcFiles: any;
    focusedFiles: any;
    files: any;
    testFiles: any;
  }>(item);

  const { tutorial, test, srcFiles, focusedFiles, files, testFiles } =
    tutorialItem;

  const [isInitializing, setIsInitializing] = useState(true);
  const [code, setCode] = useState<string | undefined>("");
  const [isRunning, setIsRunning] = useState(false);
  const [isAborting, setIsAborting] = useState(false);
  const webcontainerInstance = useRef<WebContainer | null>(null);
  const terminalInstance = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const shellRef = useRef<any>(null);
  const [chapter, setChapter] = useState(c);
  const [section, setSection] = useState(s);
  const [currentDirectory, setCurrentDirectory] = useState("");

  const onClick = (code: string, dir: string) => {
    setCodeChange(code, dir);
  };

  const setCodeChange = (code: string | undefined, dir?: string) => {
    if (!code) return;
    setCode(code);
    webcontainerInstance.current?.fs.writeFile(
      `/src/${dir ?? currentDirectory}`,
      code
    );
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
    terminalInstance.current.clear();
  };

  const runTest = async () => {
    setIsRunning(true);
    inputRef.current.write(
      `node --experimental-vm-modules --experimental-wasm-threads node_modules/jest/bin/jest.js ${test} \r`
    );
  };

  const showMe = () => {
    setCodeChange(finalCodeBlock);
  };

  const initializeTerminal = async () => {
    const terminalEl = document.querySelector(".terminal") as HTMLDivElement;
    const { Terminal } = await import("xterm");
    const { FitAddon } = await import("xterm-addon-fit");
    const terminal = new Terminal({
      convertEol: true,
    });
    terminalInstance.current = terminal;
    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    terminal.open(terminalEl);
    fitAddon.fit();
    window.addEventListener("resize", () => {
      fitAddon.fit();
    });
  };

  const createProcess = async () => {
    if (!webcontainerInstance.current) return;
    const shellProcess = await webcontainerInstance.current.spawn("jsh", {
      terminal: {
        cols: terminalInstance.current.cols,
        rows: terminalInstance.current.rows,
      },
    });

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
          terminalInstance.current.write(data);
        },
      })
    );
    return {
      input,
      shellProcess,
    };
  };

  const requestSection = async (chapter: string, section: string) => {
    try {
      const response = await axios.post(
        "/api/sectionFiles",
        { chapter, section },
        { headers: { "Content-Type": "application/json" } }
      );
      const { files, tutorial, focusedFiles, testFiles, test } = response.data;
      setTutorialItem({
        ...tutorialItem,
        tutorial,
        focusedFiles,
        test,
      });
      const mountFiles = getCombinedFiles(
        srcFiles,
        files,
        focusedFiles,
        testFiles
      );
      await webcontainerInstance.current?.mount(mountFiles);
    } catch (error) {
      console.error(error);
    }
  };

  const startWebContainer = async () => {
    const { WebContainer } = await import("@webcontainer/api");
    if (webcontainerInstance.current) return;
    webcontainerInstance.current = await WebContainer.boot();
    const mountFiles = getCombinedFiles(
      srcFiles,
      files,
      focusedFiles,
      testFiles
    );
    await webcontainerInstance.current.mount(mountFiles);

    const exitCode = await installDependencies();
    if (exitCode !== 0) {
      throw new Error("Installation failed");
    }

    await createProcess();
    setIsInitializing(false);
  };

  const initialize = async () => {
    setIsInitializing(true);
    await initializeTerminal();
    await startWebContainer();
  };

  useEffect(() => {
    void initialize();
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

  useEffect(() => {
    if (isAborting || !terminalInstance.current) return;
    terminalInstance.current.clear();
  }, [isAborting]);

  const handleEditorDidMount = useCallback((editor: any, monaco: any) => {
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.Preserve,
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      esModuleInterop: true,
    });

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });

    const monacoJsxSyntaxHighlight = new MonacoJsxSyntaxHighlight(
      getWorker(),
      monaco
    );

    const { highlighter, dispose } =
      monacoJsxSyntaxHighlight.highlighterBuilder({
        editor: editor,
      });

    highlighter();

    editor.onDidChangeModelContent(() => {
      highlighter();
    });

    return dispose;
  }, []);

  const onSetSection = (section: string) => {
    setSection(section);
    setCode("");
    setCurrentDirectory("");
    void requestSection(chapter, section);
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
      <main className={styles.main}>
        <Header />
        <div className="flex flex-1 grid lg:grid-cols-2">
          <div className="bg-[#eee]">
            <Breadcrumb
              chapterIndex={chapter}
              sectionIndex={section}
              setChapter={setChapter}
              setSection={onSetSection}
              items={tutorials}
            />
            <div className="px-4">
              <div id="tutorial">
                <MDXRemote {...tutorial} />
              </div>
              <div className="flex justify-between">
                <button
                  onClick={showMe}
                  type="button"
                  className="mt-4 text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2"
                >
                  Show me
                </button>
                <button
                  type="button"
                  className="inline-flex mt-4 text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2"
                >
                  Next
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 ml-2 -mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-1 border-b-2 flex-row">
              <Tree
                data={focusedFiles}
                onBlur={() => null}
                onClick={onClick}
                setCurrentDirectory={setCurrentDirectory}
                currentDirectory={currentDirectory}
              />
              <Editor
                className="editor max-lg:h-[300px]"
                path={"file:///index.tsx"}
                defaultLanguage="typescript"
                value={code}
                onChange={(value) => setCodeChange(value)}
                onMount={handleEditorDidMount}
                options={{
                  fontSize: 14,
                  lineHeight: 24.5,
                  automaticLayout: true,
                }}
              />
            </div>
            <div>
              <div className="p-2">
                {isInitializing ? (
                  <Loader
                    text="Initializing Smart contract"
                    circleColor={"text-black"}
                    spinnerColor={"fill-orange-500"}
                  />
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={isRunning ? abortTest : runTest}
                      className={`inline-flex w-36 text-white bg-gradient-to-r ${
                        isRunning
                          ? "from-red-400 via-red-500 to-red-600"
                          : "from-green-400 via-green-500 to-green-600"
                      } hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
                    >
                      {isRunning || isAborting ? (
                        isAborting ? (
                          <svg
                            aria-hidden="true"
                            className={`w-5 h-5 mr-2 text-white animate-spin fill-black`}
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                            className="w-5 h-5 mr-2 "
                          >
                            <path
                              d="M0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96z"
                              fill="#FFF"
                            />
                          </svg>
                        )
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 384 512"
                          className="w-5 h-5 mr-2 "
                        >
                          <path
                            fill="#FFF"
                            d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
                          />
                        </svg>
                      )}
                      {isRunning ? "Abort tests" : "Run tests"}
                    </button>
                    <div className="inline-flex pl-2">
                      <span>or</span>
                      <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
                        CTRL + S
                      </span>
                    </div>
                  </>
                )}
              </div>
              <div className="terminal h-[250px] max-w-[100vw]" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
