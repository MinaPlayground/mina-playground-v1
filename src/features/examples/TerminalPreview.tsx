import { FC, useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectServerUrl } from "@/features/webcontainer/webcontainerSlice";
import RunScriptButton from "@/components/terminal/RunScriptButton";
import ProjectTerminal from "@/components/terminal/ProjectTerminal";
import Iframe from "@/components/iframe/Iframe";

const TerminalPreview: FC<TerminalPreviewProps> = ({
  onRun,
  onAbort,
  shouldShowPreview,
}) => {
  const serverUrl = useAppSelector(selectServerUrl);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (!serverUrl || !shouldShowPreview) return;
    setPreviewOpen(true);
  }, [serverUrl]);

  return (
    <div className="flex flex-col">
      <div className="flex items-center bg-gray-700">
        <RunScriptButton
          onRun={onRun}
          abortTitle={"Abort"}
          onAbort={onAbort}
          runTitle={"Run"}
        />
        <button
          onClick={() => setPreviewOpen(false)}
          className={`btn-sm h-full text-white hover:btn-secondary ${
            !previewOpen && "btn-primary"
          }`}
        >
          Terminal
        </button>
        {shouldShowPreview && (
          <button
            onClick={() => setPreviewOpen(true)}
            className={`btn-sm h-full text-white hover:btn-secondary ${
              previewOpen && "btn-primary"
            }`}
          >
            Preview
          </button>
        )}
      </div>
      <div className={`flex flex-1 ${previewOpen && "hidden"}`}>
        <ProjectTerminal />
      </div>
      <div className={`flex flex-1 ${!previewOpen && "hidden"}`}>
        <Iframe />
      </div>
    </div>
  );
};

interface TerminalPreviewProps {
  onRun(): void;
  onAbort(): void;
  shouldShowPreview: boolean;
}
export default TerminalPreview;
