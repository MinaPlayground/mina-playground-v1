import { FC, useState } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { setChangedFields } from "@/features/fileTree/fileTreeSlice";
import { DeleteActionIcon } from "@/icons/FileSystemActionIcons";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  selectIsRunning,
  setIsRunning,
  writeCommand,
} from "@/features/webcontainer/webcontainerSlice";
import Spinner from "@/components/Spinner";

const DependencyManager: FC<DependencyManagerProps> = ({
  directory,
  packageJSONFileContents,
}) => {
  const dispatch = useAppDispatch();
  const [dependency, setDependency] = useState("");
  const [dependencies, setDependencies] = useState(
    JSON.parse(packageJSONFileContents)?.dependencies ?? {}
  );
  const isRunning = useAppSelector(selectIsRunning);

  const onDelete = (key: string) => {
    const newDependencies = { ...dependencies };
    delete newDependencies[key];
    setDependencies(newDependencies);

    const packageJSON = JSON.parse(packageJSONFileContents);
    packageJSON["dependencies"] = newDependencies;
    dispatch(
      setChangedFields({
        location: "package*json",
        currentCode: JSON.stringify(packageJSON),
        previousCode: packageJSONFileContents,
      })
    );
  };

  const addDependency = () => {
    const newDependencies = { ...dependencies, [dependency]: "*" };
    setDependencies(newDependencies);
    const packageJSON = JSON.parse(packageJSONFileContents);
    packageJSON["dependencies"] = newDependencies;
    dispatch(
      setChangedFields({
        location: "package*json",
        currentCode: JSON.stringify(packageJSON),
        previousCode: packageJSONFileContents,
      })
    );
    dispatch(setIsRunning(true));
    dispatch(writeCommand(`npm install ${dependency} \r`));
  };

  return (
    <div className="p-2 text-gray-200">
      {Object.entries(dependencies).map(([key, value]) => (
        <div key={key} className="flex group justify-between">
          <span>{key}</span>
          <div className="flex items-center gap-2">
            <span>{value}</span>
            <div className="hidden group-hover:block">
              <DeleteActionIcon onClick={(event) => onDelete(key)} />
            </div>
            {key === dependency && isRunning && (
              <Spinner
                circleColor={"text-gray-400"}
                spinnerColor={"fill-white"}
                size="4"
              />
            )}
          </div>
        </div>
      ))}
      <label className="form-control w-full my-2">
        <input
          type="text"
          placeholder="Enter package name"
          value={dependency}
          onChange={(e) => setDependency(e.target.value)}
          onKeyPress={(event) => {
            if (event.key !== "Enter") return;
            addDependency();
          }}
          className="input input-bordered input-sm w-full text-gray-200"
        />
      </label>
    </div>
  );
};

interface DependencyManagerProps {
  directory: string;
  packageJSONFileContents: string;
}

export default DependencyManager;
