import { FC, PropsWithChildren } from "react";

const TutorialSectionHeader: FC<PropsWithChildren> = ({ children }) => {
  return <h2 className="my-4 text-2xl text-gray-200">{children}</h2>;
};

export default TutorialSectionHeader;
