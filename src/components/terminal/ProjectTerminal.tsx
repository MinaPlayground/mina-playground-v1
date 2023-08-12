import { FC } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectInitializingWebContainerError } from "@/features/webcontainer/webcontainerSlice";
import * as React from "react";

const ProjectTerminal: FC = () => {
  const webcontainerError = useAppSelector(selectInitializingWebContainerError);

  if (webcontainerError) {
    return (
      <h1 className="text-white p-2 bg-black h-full">
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

  return <div className="terminal h-full bg-black" />;
};

export default ProjectTerminal;
