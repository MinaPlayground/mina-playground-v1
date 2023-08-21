import { TutorialResponse } from "@/types";
import Unit from "@/components/tutorial-types/Unit";

export const mapTypeToTutorialComponent = (item: TutorialResponse) => {
  const { type } = item;
  switch (type) {
    case "unit":
    case "playground":
      const { files, focusedFiles, highlightedItem } = item;
      return (
        <Unit
          highlightedItem={highlightedItem}
          files={files}
          focusedFiles={focusedFiles}
        />
      );
    case "theory":
      return <h1>Theory</h1>;
  }
};
