import { FC, PropsWithChildren } from "react";

const RunHeader: FC<PropsWithChildren> = ({ children }) => {
  return (
    <h1 className="mt-4 p-2 shadow-2xl rounded-md text-4xl font-bold leading-none tracking-tight md:text-3xl lg:text-2xl text-white bg-green-600">
      {children}
    </h1>
  );
};

export default RunHeader;
