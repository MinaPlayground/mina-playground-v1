import { FC } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectIsTestPassed } from "@/features/webcontainer/webcontainerSlice";

const TerminalStatus: FC = () => {
  const isTestPassed = useAppSelector(selectIsTestPassed);

  if (isTestPassed === null) return null;
  const { style, title, message } = isTestPassed
    ? {
        style: "text-green-800 bg-green-100",
        title: "Success!",
        message: "You have passed the tutorial.",
      }
    : {
        style: "text-red-800 bg-red-50",
        title: "Failed!",
        message: "One of the tests failed.",
      };
  return (
    <div className={`p-4 mb-4 rounded-lg ${style}`} role="alert">
      <span className="font-bold">{title}</span> {message}
    </div>
  );
};

export default TerminalStatus;
