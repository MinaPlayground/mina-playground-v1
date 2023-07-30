import { FC } from "react";
import Loader from "@/components/Loader";
import TerminalStatus from "@/components/terminal/TerminalStatus";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectIsRunning } from "@/features/webcontainer/webcontainerSlice";

const TerminalOutput: FC = () => {
  const isRunning = useAppSelector(selectIsRunning);

  return (
    <div className="bg-black h-[125px] p-2">
      {isRunning ? (
        <Loader
          text="Running tests, please wait"
          circleColor={"text-white"}
          spinnerColor={"fill-orange-500"}
        />
      ) : (
        <TerminalStatus />
      )}
    </div>
  );
};

export default TerminalOutput;
