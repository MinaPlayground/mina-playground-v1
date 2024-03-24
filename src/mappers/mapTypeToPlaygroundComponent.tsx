import { TutorialResponse } from "@/types";
import TerminalPreview from "@/features/examples/TerminalPreview";
import * as React from "react";
import { Deploy } from "@/features/deploy/Deploy";

export const mapTypeToPlaygroundComponent = (item: TutorialResponse) => {
  const { type, command } = item;
  switch (type) {
    case "unit":
    case "playground":
      return (
        <TerminalPreview onRunCommand={command} shouldShowPreview={false} />
      );
    case "playground-zkApp":
      return (
        <TerminalPreview onRunCommand={command} shouldShowPreview={true} />
      );
    case "deploy":
      return <Deploy />;
  }
};
