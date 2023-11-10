import { FC, PropsWithChildren } from "react";

const TutorialOrderedList: FC<PropsWithChildren> = ({ children }) => {
  return <ul className="list-decimal text-gray-200 pl-4">{children}</ul>;
};

export default TutorialOrderedList;
