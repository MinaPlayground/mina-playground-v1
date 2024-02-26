import { FC, useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  selectServerUrl,
  writeCommand,
} from "@/features/webcontainer/webcontainerSlice";
import RunScriptButton from "@/components/terminal/RunScriptButton";
import ProjectTerminal from "@/components/terminal/ProjectTerminal";
import Iframe from "@/components/iframe/Iframe";
import { useAppDispatch } from "@/hooks/useAppDispatch";

const TerminalPreview: FC<TerminalPreviewProps> = ({
  onRunCommand,
  shouldShowPreview,
  fullScreen = false,
}) => {
  const serverUrl = useAppSelector(selectServerUrl);
  const dispatch = useAppDispatch();
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (!serverUrl || !shouldShowPreview) return;
    setPreviewOpen(true);
  }, [serverUrl]);

  const onRun = () => {
    dispatch(writeCommand(`${onRunCommand} \r`));
  };

  const onAbort = () => dispatch(writeCommand("\u0003"));

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
        <ProjectTerminal fullScreen={fullScreen} />
      </div>
      <div className={`flex flex-1 ${!previewOpen && "hidden"}`}>
        <Iframe />
      </div>
    </div>
  );
};

interface TerminalPreviewProps {
  onRunCommand: string;
  shouldShowPreview: boolean;
  fullScreen?: boolean;
}
export default TerminalPreview;
