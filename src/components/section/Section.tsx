import { FC, PropsWithChildren } from "react";

const SectionItem: FC<PropsWithChildren> = ({ children }) => {
  return (
    <section>
      <div className="px-4 mx-auto max-w-screen-xl mb-12">{children}</div>
    </section>
  );
};

export default SectionItem;
