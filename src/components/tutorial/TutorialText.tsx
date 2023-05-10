import { FC, PropsWithChildren } from "react";

const TutorialText: FC<PropsWithChildren> = ({ children }) => {
  return <p className="my-1">{children}</p>;
};

export default TutorialText;
