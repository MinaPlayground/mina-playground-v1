import { FC } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectFileSystemTree } from "@/features/fileTree/fileTreeSlice";
import DependencyManager from "@/features/project/DependencyManager";
import Loader from "@/components/Loader";

const DependencyManagerLoader: FC<DependencyManagerLoaderProps> = ({}) => {
  const fileData = useAppSelector(selectFileSystemTree);
  const hasPackageJSON = fileData ? fileData["package*json"] : false;
  return hasPackageJSON ? (
    <DependencyManager />
  ) : (
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
