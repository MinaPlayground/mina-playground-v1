import { TutorialResponse } from "@/types";
import InteractiveTutorial from "@/components/tutorial-types/InteractiveTutorial";

export const mapTypeToTutorialComponent = (item: TutorialResponse) => {
  const { type } = item;
  switch (type) {
    case "unit":
    case "playground":
      const { files, focusedFiles, highlightedItem, filesArray, base } = item;
      return (
        <InteractiveTutorial
          type={type}
          highlightedItem={highlightedItem}
          files={files}
          filesArray={filesArray}
          focusedFiles={focusedFiles}
          base={base}
        />
      );
  }
};
