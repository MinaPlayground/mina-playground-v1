import { FC, PropsWithChildren } from "react";

const TutorialHeader: FC<PropsWithChildren> = ({ children }) => {
  return (
    <h1 className="mt-4 px-2 rounded-md py-1 text-4xl font-bold leading-none tracking-tight md:text-5xl lg:text-2xl text-white bg-gradient-to-br from-pink-500 to-orange-400">
      {children}
    </h1>
  );
};

export default TutorialHeader;
