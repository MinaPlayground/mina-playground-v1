import { useAppSelector } from "@/hooks/useAppSelector";
import { selectServerUrl } from "@/features/webcontainer/webcontainerSlice";
import * as React from "react";
import { FC, useState } from "react";
import Loader from "@/components/Loader";

const Iframe: FC = () => {
  const serverUrl = useAppSelector(selectServerUrl);
  const [loading, setIsLoading] = useState(true);
  return (
    <div className="flex flex-1 bg-white">
      {loading && (
        <div className="flex flex-1 justify-center items-center">
          <Loader
            text="Loading preview"
            circleColor={"text-gray-400"}
            spinnerColor={"fill-white"}
          />
        </div>
      )}
      <iframe
        onLoad={() => setIsLoading(false)}
        src={serverUrl}
        className={`bg-gray-100 flex-1 ${loading && "hidden"}`}
        allow="cross-origin-isolated"
      />
    </div>
  );
};

export default Iframe;
