import { FC, useState } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  selectFileSystemTree,
  setChangedFields,
} from "@/features/fileTree/fileTreeSlice";
import { DeleteActionIcon } from "@/icons/FileSystemActionIcons";
import { useAppDispatch } from "@/hooks/useAppDispatch";

const DependencyManager: FC<DependencyManagerProps> = ({ id, name }) => {
  const dispatch = useAppDispatch();
  const fileData = useAppSelector(selectFileSystemTree);
  const [dependency, setDependency] = useState("");
  const [dependencies, setDependencies] = useState(
    JSON.parse(fileData["package*json"].file.contents).dependencies
  );

  const onDelete = (key: string) => {
    const newDependencies = { ...dependencies };
    delete newDependencies[key];
    setDependencies(newDependencies);

    const packageJSON = JSON.parse(fileData["package*json"].file.contents);
    packageJSON["dependencies"] = newDependencies;
    dispatch(
      setChangedFields({
        location: "package*json",
        currentCode: JSON.stringify(packageJSON),
        previousCode: fileData["package*json"].file.contents,
      })
    );
  };

  const addDependency = () => {
    const newDependencies = { ...dependencies, [dependency]: "*" };
    setDependencies(newDependencies);
    const packageJSON = JSON.parse(fileData["package*json"].file.contents);
    packageJSON["dependencies"] = newDependencies;
    dispatch(
      setChangedFields({
        location: "package*json",
        currentCode: JSON.stringify(packageJSON),
        previousCode: fileData["package*json"].file.contents,
      })
    );
  };

  return (
    <div className="p-2 text-gray-200">
      {Object.entries(dependencies).map(([key, value]) => (
        <div className="flex group justify-between">
          <span>{key}</span>
          <div className="flex items-center gap-2">
            <span>{value}</span>
            <div className="hidden group-hover:block">
              <DeleteActionIcon onClick={(event) => onDelete(key)} />
            </div>
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
  id: string;
  name: string;
}

export default DependencyManager;
