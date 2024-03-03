import { FC } from "react";
import { SaveIcon, SuccessIcon } from "@/icons/SaveCodeIcons";

const ResetCode: FC<ResetCodeProps> = ({
  disabled,
  onClick,
  defaultText = "Reset code",
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type="button"
      className="text-gray-200 hover:text-white hover:bg-black focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-1.5 text-center mr-2 inline-flex items-center disabled:opacity-50 disabled:pointer-events-none
"
    >
      {disabled ? <SuccessIcon /> : <SaveIcon />}
      <span>{defaultText}</span>
    </button>
  );
};

interface ResetCodeProps {
  disabled: boolean;
  defaultText?: string;
  onClick(): void;
}

export default ResetCode;
