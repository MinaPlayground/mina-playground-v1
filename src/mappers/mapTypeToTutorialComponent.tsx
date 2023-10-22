import { TutorialResponse } from "@/types";
import InteractiveTutorial from "@/components/tutorial-types/InteractiveTutorial";

export const mapTypeToTutorialComponent = (item: TutorialResponse) => {
  const { type } = item;
  switch (type) {
    case "unit":
    case "playground":
      const { files, focusedFiles, highlightedItem, filesArray } = item;
      return (
        <InteractiveTutorial
          type={type}
          highlightedItem={highlightedItem}
          files={files}
          filesArray={filesArray}
          focusedFiles={focusedFiles}
        />
      );
    case "theory":
      return <h1></h1>;
  }
};
