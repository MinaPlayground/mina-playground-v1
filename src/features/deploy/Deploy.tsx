import { FC, useState } from "react";
import Steps from "@/components/step/Steps";
import StepBody from "@/components/step/StepBody";
import * as React from "react";
import { AddContract } from "@/features/deploy/AddContract";
import { SetKeys } from "@/features/deploy/SetKeys";

export const Deploy: FC<DeployProps> = ({}) => {
  const [stepIndex, setStepIndex] = useState(1);

  const onNextClick = () => {
    if (stepIndex === 3) return;
    setStepIndex((prevIndex) => prevIndex + 1);
  };
  return (
    <div>
      <Steps
        items={["Add Contract", "Set keys", "Deploy"]}
        stepIndex={stepIndex}
      />
      <StepBody
        items={[
          { Component: AddContract, props: { onNextClick, code: "test" } },
          { Component: SetKeys, props: { onNextClick } },
        ]}
        stepIndex={stepIndex}
      />
    </div>
  );
};

interface DeployProps {}
