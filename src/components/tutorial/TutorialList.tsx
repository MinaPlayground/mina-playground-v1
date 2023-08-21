import { FC, PropsWithChildren } from "react";

const TutorialList: FC<PropsWithChildren> = ({ children }) => {
  return <ul className="list-disc text-gray-200 pl-4">{children}</ul>;
};

export default TutorialList;
