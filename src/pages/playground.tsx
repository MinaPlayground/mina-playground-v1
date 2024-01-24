import Head from "next/head";
import Header from "@/components/Header";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { TutorialParams, TutorialResponse } from "@/types";
import CodeEditor from "@/components/editor/CodeEditor";
import * as React from "react";
import { useEffect, useState } from "react";
import ProjectTerminal from "@/components/terminal/ProjectTerminal";
import {
  initializeTerminal,
  installDependencies,
  removeFiles,
  selectInitializingEsbuild,
  selectIsRemovingFiles,
  selectWebcontainerInstance,
  selectWebcontainerStarted,
  writeCommand,
} from "@/features/webcontainer/webcontainerSlice";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { smartContractTemplate } from "../../templates/smartContract";
import { setChangedFields } from "@/features/fileTree/fileTreeSlice";
import RunScriptButton from "@/components/terminal/RunScriptButton";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";

const items = {
  "01-introduction": {
    name: "Add",
    sections: {
      "01-o1js": { name: "o1js" },
      "02-basic-concepts": { name: "Basic concepts" },
      "03-common-methods": { name: "Common methods" },
      "04-other-common-methods": { name: "Other common methods" },
      "05-functions": { name: "Functions" },
      "06-conditionals": { name: "Conditionals" },
    },
  },
};

const examples = [
  {
    name: "Add",
    src: smartContractTemplate,
    highlightedCode:
      smartContractTemplate.src.directory["Add*test*ts"].file.contents,
    options: {
      focus: ["src/Add.ts", "src/Add.test.ts"],
      highlight: "src/Add.ts",
    },
  },
];

const Home: NextPage<IHomeProps> = ({ c, s, item }) => {
  const dispatch = useAppDispatch();
  const webcontainerInstance = useAppSelector(selectWebcontainerInstance);
  const webcontainerStarted = useAppSelector(selectWebcontainerStarted);
  const initializingWebcontainer = useAppSelector(selectInitializingEsbuild);
  const isRemovingFiles = useAppSelector(selectIsRemovingFiles);
  const [exampleIndex, setExampleIndex] = useState(0);

  const { src, highlightedCode, options } = examples[exampleIndex];
  const [code, setCode] = useState<string | undefined>(highlightedCode);

  useEffect(() => {
    if (!webcontainerStarted) {
      dispatch(installDependencies({ fileSystemTree: {} }));
      return;
    }
  }, [webcontainerStarted]);

  useEffect(() => {
    if (initializingWebcontainer) return;
    dispatch(initializeTerminal());
    return;
  }, [initializingWebcontainer]);

  const remove = async () => {
    if (!webcontainerInstance) return;
    dispatch(removeFiles([]));
  };

  const mount = async () => {
    if (!webcontainerInstance) return;
    await webcontainerInstance.mount(src);
  };

  useEffect(() => {
    if (!webcontainerInstance) return;
    return () => {
      void remove();
    };
  }, [webcontainerInstance]);

  useEffect(() => {
    if (!webcontainerInstance || isRemovingFiles) return;
    void mount();
  }, [webcontainerInstance, isRemovingFiles]);

  const onCodeChange = (value: string | undefined) => {
    const code = value || "";
    setCode(code);
    webcontainerInstance?.fs.writeFile("src/Add.ts", code);
  };

  const onRun = () => {
    dispatch(writeCommand("npm run test \r"));
  };

  const onAbort = () => {};

  return (
    <>
      <Head>
        <title>Mina Playground</title>
        <meta name="description" content="Interactive tutorials" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" />
      </Head>
      <main>
        <Header />
        <div className="flex flex-1 grid lg:grid-cols-2">
          <div className="flex flex-col">
            <Breadcrumb
              chapterIndex={"01-introduction"}
              sectionIndex={"01-o1js"}
              items={items}
            />
            <div className="flex bg-gradient-to-br from-pink-600 to-orange-400 mb-2 rounded-lg mx-4 mt-2">
              {options.focus.map((item) => (
                <button
                  onClick={() => null}
                  className={`btn-sm text-white hover:btn-secondary`}
                >
                  {item}
                </button>
              ))}
            </div>
            <CodeEditor code={code} setCodeChange={onCodeChange} />
          </div>
          <div className="flex flex-1 flex-col">
            <div className="p-2">
              <RunScriptButton
                onRun={onRun}
                abortTitle={"Abort"}
                onAbort={onAbort}
                runTitle={"Run"}
              />
            </div>
            <ProjectTerminal />
          </div>
        </div>
      </main>
    </>
  );
};

interface IHomeProps {
  c: string;
  s: string;
  item: TutorialResponse;
}

export default Home;
