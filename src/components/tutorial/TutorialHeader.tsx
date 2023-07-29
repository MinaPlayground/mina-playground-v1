import { FC, PropsWithChildren } from "react";

const TutorialHeader: FC<PropsWithChildren> = ({ children }) => {
  return (
    <h1 className="mt-4 px-2 shadow-2xl rounded-md py-1 text-4xl font-bold leading-none tracking-tight md:text-5xl lg:text-2xl text-gray-200 bg-gray-800">
      {children}
    </h1>
  );
};

export default TutorialHeader;
