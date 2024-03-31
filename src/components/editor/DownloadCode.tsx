import { FC } from "react";
import { DownloadIcon } from "@/icons/SaveCodeIcons";
import JSZip from "jszip";
import { fileSystemTreeToZip } from "@/utils/zip";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectFileSystemTree } from "@/features/fileTree/fileTreeSlice";

const DownloadCode: FC<DownloadCodeProps> = () => {
  const fileData = useAppSelector(selectFileSystemTree);

  const onDownload = async () => {
    if (!fileData) return;
    const zip = new JSZip();
    fileSystemTreeToZip(fileData, zip);
    zip.generateAsync({ type: "base64" }).then(function (base64) {
      // @ts-ignore
      window.location = "data:application/zip;base64," + base64;
    });
  };
  return (
    <button
      onClick={onDownload}
      type="button"
      className="text-gray-200 hover:text-white hover:bg-black focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-1.5 text-center mr-2 inline-flex items-center disabled:opacity-50 disabled:pointer-events-none
"
    >
      {<DownloadIcon />}
      <span>Download project</span>
    </button>
  );
};

interface DownloadCodeProps {}

export default DownloadCode;
