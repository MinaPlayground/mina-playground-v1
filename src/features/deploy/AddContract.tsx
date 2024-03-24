import { FC } from "react";
import Button from "@/components/button/Button";

export const AddContract: FC<AddContractProps> = ({ code, onNextClick }) => {
  return (
    <>
      <h1>Add/change your contract code</h1>
      <Button disabled={!code} onClick={onNextClick}>
        Next
      </Button>
    </>
  );
};

interface AddContractProps {
  code: string;
  onNextClick(): void;
}
