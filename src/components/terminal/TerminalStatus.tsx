import { FC } from "react";

const TerminalStatus: FC<TerminalStatusProps> = ({ terminalOutput }) => {
  if (terminalOutput === null) return null;
  const { style, title, message } = terminalOutput
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

interface TerminalStatusProps {
  terminalOutput: boolean | null;
}

export default TerminalStatus;
