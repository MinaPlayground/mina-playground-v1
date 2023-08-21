import { FC, PropsWithChildren } from "react";

const TutorialText: FC<PropsWithChildren> = ({ children }) => {
  return <p className="text-gray-200 my-2.5">{children}</p>;
};

export default TutorialText;
