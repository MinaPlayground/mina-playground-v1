import { FC } from "react";
import { dynamicComponents } from "@/tutorials";

type DynamicComponentKey = keyof typeof dynamicComponents;

const DynamicTutorial: FC<DynamicTutorialProps> = ({ chapter, section }) => {
  const dynamicComponentKey = `C${chapter}S${section}`;
  const Component =
    dynamicComponents[dynamicComponentKey as DynamicComponentKey];
  return <Component />;
};

interface DynamicTutorialProps {
  chapter: number;
  section: number;
}

export default DynamicTutorial;
