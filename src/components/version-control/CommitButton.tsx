import { FC } from "react";
import { ErrorIcon, Spinner, SuccessIcon } from "@/icons/SaveCodeIcons";
import { CommitIcon } from "@/icons/VersionControlIcons";

const mapStatusToIconText = (
  isLoading: boolean,
  isSaved: boolean,
  isError: boolean
) => {
  if (isLoading) {
    return {
      text: "Saving...",
      Icon: <Spinner />,
    };
  }
  if (isSaved) {
    return {
      text: "Saved",
      Icon: <SuccessIcon />,
    };
  }
  if (isError) {
    return {
      text: "Retry",
      Icon: <ErrorIcon />,
    };
  }
  return {
    text: "Commit",
    Icon: <CommitIcon />,
  };
};

const CommitButton: FC<CommitButtonProps> = ({
  disabled,
  isLoading,
  isSaved,
  isError,
  onClick,
}) => {
  const { text, Icon } = mapStatusToIconText(isLoading, isSaved, isError);
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading || isSaved}
      type="button"
      className="text-gray-200 hover:text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-1.5 text-center mr-2 inline-flex items-center disabled:opacity-50 disabled:pointer-events-none
"
    >
      {Icon}
      {text}
    </button>
  );
};

interface CommitButtonProps {
  disabled: boolean;
  isLoading: boolean;
  isSaved: boolean;
  isError: boolean;
  onClick(): void;
}

export default CommitButton;
