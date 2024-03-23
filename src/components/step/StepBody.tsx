import { FC } from "react";

const StepBody: FC<StepBodyProps> = ({ items, stepIndex }) => {
  const Component = items[stepIndex - 1];
  return <Component />;
};

interface StepBodyProps {
  items: FC<{}>[];
  stepIndex: number;
}

export default StepBody;
