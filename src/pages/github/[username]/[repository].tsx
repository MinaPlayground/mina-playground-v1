import Head from "next/head";
import Header from "@/components/Header";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  initializeTerminal,
  installDependencies,
  selectInitializingEsbuild,
  selectTerminalInitialized,
  selectWebcontainerStarted,
  writeCommand,
} from "@/features/webcontainer/webcontainerSlice";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useRouter } from "next/router";
import DockView from "@/components/dockview/DockView";

const GitHub: NextPage<HomeProps> = ({}) => {
  const { query } = useRouter();
  const { username, repository } = query;
  const dispatch = useAppDispatch();
  const webcontainerStarted = useAppSelector(selectWebcontainerStarted);
  const terminalInitialized = useAppSelector(selectTerminalInitialized);
  const initializingWebcontainer = useAppSelector(selectInitializingEsbuild);

  useEffect(() => {
    if (!webcontainerStarted) {
      dispatch(
        installDependencies({ fileSystemTree: {}, hasPackageJSON: false })
      );
      return;
    }
  }, [webcontainerStarted]);

  useEffect(() => {
    if (initializingWebcontainer) return;
    dispatch(initializeTerminal({}));
  }, [initializingWebcontainer]);

  useEffect(() => {
    if (!terminalInitialized) return;
    dispatch(
      writeCommand(
        `git clone https://github.com/${username}/${repository}.git './' \r`
      )
    );
  }, [terminalInitialized]);

  return (
    <>
      <Head>
        <title>Mina Playground</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header />
        <DockView id={"GitHub_repo"} name={"Github Repository"} />
      </main>
    </>
  );
};

interface HomeProps {}

export default GitHub;
