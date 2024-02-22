import Head from "next/head";
import Header from "@/components/Header";
import type { NextPage } from "next";
import CodeEditor from "@/components/editor/CodeEditor";
import * as React from "react";
import { useEffect, useState } from "react";
import {
  initializeTerminal,
  installDependencies,
  selectInitializingEsbuild,
  selectWebcontainerInstance,
  selectWebcontainerStarted,
  writeCommand,
} from "@/features/webcontainer/webcontainerSlice";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import TerminalPreview from "@/features/examples/TerminalPreview";
import { GetServerSideProps } from "next";
import axios from "axios";
import CreateSnippet from "@/features/snippet/CreateSnippet";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { snippet } = query;
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/snippet/${snippet}`
    );
    const { data } = response;
    return {
      props: { data },
    };
  } catch {
    return {
      props: { data: null },
    };
  }
};

const Home: NextPage<IHomeProps> = ({ data }) => {
  const dispatch = useAppDispatch();
  const webcontainerInstance = useAppSelector(selectWebcontainerInstance);
  const webcontainerStarted = useAppSelector(selectWebcontainerStarted);
  const initializingWebcontainer = useAppSelector(selectInitializingEsbuild);
  const { name, code: snippetCode } = data;
  const [code, setCode] = useState(snippetCode);

  const snippetFile = {
    src: { directory: { "main.ts": { file: { contents: code } } } },
  };

  const mount = async () => {
    if (!webcontainerInstance) return;
    await webcontainerInstance.mount(snippetFile);
  };

  useEffect(() => {
    if (!webcontainerStarted) {
      dispatch(
        installDependencies({ base: "smart-contract", isExamples: true })
      );
      return;
    }
  }, [webcontainerStarted]);

  useEffect(() => {
    if (initializingWebcontainer) return;
    dispatch(initializeTerminal());
  }, [initializingWebcontainer]);

  useEffect(() => {
    if (!webcontainerInstance) return;
    void mount();
  }, [webcontainerInstance]);

  const onCodeChange = (value: string | undefined) => {
    setCode(value || "");
    webcontainerInstance?.fs.writeFile(`src/main.ts`, code);
  };

  const onRun = () => {
    dispatch(writeCommand(`npm run build && node build/src/main.js \r`));
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
            <CreateSnippet code={code} />
            <CodeEditor code={code} setCodeChange={onCodeChange} />
          </div>
          <TerminalPreview
            onRun={onRun}
            onAbort={onAbort}
            shouldShowPreview={false}
          />
        </div>
      </main>
    </>
  );
};

interface IHomeProps {
  data: { name: string; code: string };
}

export default Home;
