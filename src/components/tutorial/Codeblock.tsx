import { FC, PropsWithChildren } from "react";
import { Prism } from "@mantine/prism";

const Codeblock: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Prism className="bg-white rounded mb-2" language="typescript">
      {(children as { props: { children: string } }).props.children}
    </Prism>
  );
};

export default Codeblock;
