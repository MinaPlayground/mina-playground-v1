import Head from "next/head";
import Header from "@/components/Header";
import type { NextPage } from "next";
import { TutorialResponse } from "@/types";
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
import Button from "@/components/button/Button";
import { useCreateSnippetMutation } from "@/services/snippet";
import { useRouter } from "next/router";

const Home: NextPage<IHomeProps> = ({ c, s, item }) => {
  const dispatch = useAppDispatch();
  const webcontainerInstance = useAppSelector(selectWebcontainerInstance);
  const webcontainerStarted = useAppSelector(selectWebcontainerStarted);
  const initializingWebcontainer = useAppSelector(selectInitializingEsbuild);
  const [createSnippet, { isLoading, isError, isSuccess }] =
    useCreateSnippetMutation();
  const [code, setCode] = useState("");
  const [snippetName, setSnippetName] = useState("");

  const router = useRouter();

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

  const onCreateSnippet = async () => {
    const body = { name: snippetName, code };
    try {
      const response = await createSnippet({ body }).unwrap();
      // void router.push(`/project/${response.project_id}`);
    } catch {}
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
            <div className="flex flex-row p-2 gap-2">
              {/*<SaveCode*/}
              {/*  disabled={false}*/}
              {/*  onClick={() => {}}*/}
              {/*  isLoading={false}*/}
              {/*  isSaved={false}*/}
              {/*  isError={false}*/}
              {/*/>*/}
              <div className="flex flex-row gap-4">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={snippetName}
                  onChange={(evt) => setSnippetName(evt.target.value)}
                  className="bg-[#252728] border border-gray-500 text-gray-100 text-sm rounded-lg block w-full p-2.5"
                  placeholder="My snippet"
                  required
                />
                <Button onClick={onCreateSnippet}>Create snippet</Button>
              </div>
            </div>
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
  c: string;
  s: string;
  item: TutorialResponse;
}

export default Home;
