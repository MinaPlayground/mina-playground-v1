import { FC, PropsWithChildren } from "react";

const TutorialHighlightedText: FC<PropsWithChildren> = ({ children }) => {
  return (
    <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">
      {children}
    </span>
  );
};

export default TutorialHighlightedText;
