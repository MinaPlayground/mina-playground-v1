import { FC } from "react";
import Spinner from "@/components/Spinner";

const Loader: FC<LoaderProps> = ({ text, circleColor, spinnerColor }) => {
  return (
    <div className="flex flex-row items-center" role="status">
      <Spinner circleColor={circleColor} spinnerColor={spinnerColor} />
      <span className={`${circleColor}`}>{text ? text : "Loading"}...</span>
    </div>
  );
};

interface LoaderProps {
  text?: string;
  circleColor: string;
  spinnerColor: string;
}

export default Loader;
