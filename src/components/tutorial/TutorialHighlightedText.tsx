import { FC, PropsWithChildren } from "react";

const TutorialHighlightedText: FC<PropsWithChildren> = ({ children }) => {
  return (
    <span className="bg-gray-200 text-black text-sm font-medium px-2.5 py-0.5 rounded">
      {children}
    </span>
  );
};

export default TutorialHighlightedText;
