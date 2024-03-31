import { FC } from "react";
import Button from "@/components/button/Button";

export const AddContract: FC<AddContractProps> = ({ code, onNextClick }) => {
  const disabled = code !== undefined && !code;
  return (
    <>
      <span className="text-white">Add/change your contract code</span>
      <Button disabled={disabled} onClick={onNextClick}>
        Next
      </Button>
    </>
  );
};

interface AddContractProps {
  code?: string;
  onNextClick(): void;
}
