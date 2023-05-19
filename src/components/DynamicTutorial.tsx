import { FC } from "react";
import { dynamicComponents } from "@/tutorials";

type DynamicComponentKey = keyof typeof dynamicComponents;

const DynamicTutorial: FC<DynamicTutorialProps> = ({ chapter, section }) => {
  const dynamicComponentKey = `C${chapter}S${section}`;
  const Component =
    dynamicComponents[dynamicComponentKey as DynamicComponentKey] ??
    dynamicComponents["C0S0"];
  return <Component />;
};

interface DynamicTutorialProps {
  chapter: string | string[] | undefined;
  section: string | string[] | undefined;
}

export default DynamicTutorial;
