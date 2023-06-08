import { FC } from "react";
import Loader from "@/components/Loader";
import TerminalStatus from "@/components/terminal/TerminalStatus";

const TerminalOutput: FC<TerminalOutputProps> = ({
  isRunning,
  terminalOutput,
}) => {
  return (
    <div className="bg-black h-[125px] p-2">
      {isRunning ? (
        <Loader
          text="Running tests, please wait"
          circleColor={"text-white"}
          spinnerColor={"fill-orange-500"}
        />
      ) : (
        <TerminalStatus terminalOutput={terminalOutput} />
      )}
    </div>
  );
};

interface TerminalOutputProps {
  isRunning: boolean;
  terminalOutput: boolean | null;
}

export default TerminalOutput;
