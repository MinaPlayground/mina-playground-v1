import { FC } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  selectInitializingEsbuild,
  selectInitializingWebContainerError,
} from "@/features/webcontainer/webcontainerSlice";
import * as React from "react";
import WebcontainerLoader from "@/features/webcontainer/WebcontainerLoader";

const ProjectTerminal: FC = () => {
  const webcontainerError = useAppSelector(selectInitializingWebContainerError);
  const initializingWebcontainer = useAppSelector(selectInitializingEsbuild);

  if (initializingWebcontainer) {
    return (
      <div className="flex flex-1 bg-black justify-center">
        <WebcontainerLoader />
      </div>
    );
  }

  if (webcontainerError) {
    return (
      <h1 className="text-white bg-black h-full">
        {webcontainerError}.{" "}
        <a
          className="link"
          href="https://developer.stackblitz.com/platform/webcontainers/browser-support"
          target="_blank"
        >
          Make sure your browser is setup correctly.
        </a>
      </h1>
    );
  }

  return <div className="terminal flex-1 bg-black" />;
};

export default ProjectTerminal;
