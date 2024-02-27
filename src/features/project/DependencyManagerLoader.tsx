import { FC } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectFileSystemTree } from "@/features/fileTree/fileTreeSlice";
import DependencyManager from "@/features/project/DependencyManager";
import Loader from "@/components/Loader";
import { FileSystemTree } from "@webcontainer/api";

const checkPathPackageJSON = (fileData: FileSystemTree | null) => {
  // @ts-ignore
  const contractsPackageJSON = fileData?.contracts?.directory?.["package*json"];
  // @ts-ignore
  const uiPackageJSON = fileData?.ui?.directory?.["package*json"];

  if (!contractsPackageJSON || !uiPackageJSON) return [];
  return [
    { directory: "contracts", packageJSON: contractsPackageJSON.file.contents },
    {
      directory: "ui",
      packageJSON: uiPackageJSON.file.contents,
    },
  ];
};

const DependencyManagerLoader: FC<DependencyManagerLoaderProps> = ({}) => {
  const fileData = useAppSelector(selectFileSystemTree);
  // @ts-ignore
  const packageJSON = fileData?.["package*json"]?.file?.contents;
  const packageJSONPaths = checkPathPackageJSON(fileData);

  if (packageJSON) {
    return (
      <DependencyManager
        directory="main"
        packageJSONFileContents={packageJSON}
      />
    );
  }

  if (packageJSONPaths.length) {
    return (
      <>
        {packageJSONPaths.map(({ directory, packageJSON }) => (
          <DependencyManager
            directory={directory}
            packageJSONFileContents={packageJSON}
          />
        ))}
      </>
    );
  }
  return (
    <div className="p-4">
      <Loader
        text="Waiting for package.json file"
        circleColor={"text-white"}
        spinnerColor={"fill-black"}
      />
    </div>
  );
};

interface DependencyManagerLoaderProps {}

export default DependencyManagerLoader;
