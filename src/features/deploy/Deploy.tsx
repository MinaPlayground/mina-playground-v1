import { FC, useState } from "react";
import Steps from "@/components/step/Steps";
import StepBody from "@/components/step/StepBody";
import * as React from "react";
import { AddContract } from "@/features/deploy/AddContract";
import { SetKeys } from "@/features/deploy/SetKeys";
import { DeployContract } from "@/features/deploy/DeployContract";

export const Deploy: FC<DeployProps> = ({}) => {
  const [stepIndex, setStepIndex] = useState(1);

  const onNextClick = () => {
    if (stepIndex === 3) return;
    setStepIndex((prevIndex) => prevIndex + 1);
  };
  return (
    <div className="flex flex-col justify-center gap-4 p-4">
      <Steps
        items={["Add Contract", "Set keys", "Deploy"]}
        stepIndex={stepIndex}
      />
      <StepBody
        items={[
          { Component: AddContract, props: { onNextClick, code: "test" } },
          { Component: SetKeys, props: { onNextClick } },
          { Component: DeployContract, props: {} },
        ]}
        stepIndex={stepIndex}
      />
    </div>
  );
};

interface DeployProps {}
