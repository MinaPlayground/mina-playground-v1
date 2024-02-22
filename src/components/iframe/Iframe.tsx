import { useAppSelector } from "@/hooks/useAppSelector";
import { selectServerUrl } from "@/features/webcontainer/webcontainerSlice";
import * as React from "react";
import { FC, useState } from "react";
import Loader from "@/components/Loader";
import { RotateIcon } from "@/icons/BrowserIcons";

const Iframe: FC = () => {
  const serverUrl = useAppSelector(selectServerUrl);
  const [loading, setIsLoading] = useState(true);
  const loadingText = serverUrl
    ? "Loading preview"
    : "Application not started yet";
  return (
    <div className="flex flex-1 bg-white flex-col">
      <div className="flex bg-gray-600 gap-2">
        <input
          readOnly
          value={serverUrl || ""}
          className="w-96 bg-gray-800 text-white rounded-lg px-2"
        />
        <button
          onClick={() => {
            const preview = document.getElementById(
              "preview"
            ) as HTMLIFrameElement | null;
            if (!preview) return;
            preview.src = preview.src;
          }}
          className="btn btn-sm btn-circle btn-primary"
        >
          <RotateIcon />
        </button>
      </div>
      {loading && (
        <div className="flex flex-1 justify-center items-center">
          <Loader
            text={loadingText}
            circleColor={"text-gray-600"}
            spinnerColor={"fill-white"}
          />
        </div>
      )}
      <iframe
        id="preview"
        onLoad={() => setIsLoading(false)}
        src={serverUrl || ""}
        className={`bg-gray-100 flex-1 ${loading && "hidden"}`}
        allow="cross-origin-isolated"
      />
    </div>
  );
};

export default Iframe;
