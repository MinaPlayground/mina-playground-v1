import { FC, useEffect, useState } from "react";
import CodeEditor from "@/components/editor/CodeEditor";
import SaveCode from "@/components/editor/SaveCode";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectWebcontainerInstance } from "@/features/webcontainer/webcontainerSlice";
import { useUpdateFileTreeMutation } from "@/services/fileTree";
import {
  selectChangedField,
  setChangedFields,
  setChangedFieldStatus,
} from "@/features/fileTree/fileTreeSlice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { isEmpty } from "lodash";
import { Deploy } from "@/components/deploy/Deploy";
import { findSmartContractMatches } from "@/utils/deploy";
import { normalizePath, pathToWebContainerPath } from "@/utils/fileSystemWeb";

const CodeEditorWithSave: FC<CodeEditorWithSaveProps> = ({
  id,
  value,
  directory,
}) => {
  const changedField = useAppSelector((state) =>
    selectChangedField(state, directory)
  );
  const dispatch = useAppDispatch();
  const [code, setCode] = useState<string | undefined>("");
  const webcontainerInstance = useAppSelector(selectWebcontainerInstance);
  const [updateFileTree, { isLoading, isError }] = useUpdateFileTreeMutation();

  const setCodeChange = async (code: string | undefined) => {
    if (!code) return;
    setCode(code);
    dispatch(setChangedFields({ location: directory, code }));
  };

  useEffect(() => {
    const changedStoredCode = changedField?.code;
    setCode(changedStoredCode || value);
  }, []);

  const isSaved = changedField?.saved;
  const results = findSmartContractMatches(code);

  const save = async () => {
    const location = pathToWebContainerPath(directory);
    const webContainerPath = normalizePath(directory);
    try {
      await updateFileTree({
        id: id,
        body: { location: `${location}.file.contents`, code },
      }).unwrap();
      dispatch(
        setChangedFieldStatus({
          location: directory,
          saved: true,
        })
      );
      webcontainerInstance?.fs.writeFile(webContainerPath, code || "");
    } catch {}
  };

  return (
    <>
      <div className="flex items-center p-2 bg-[#131415]">
        <SaveCode
          disabled={!changedField}
          onClick={save}
          isLoading={isLoading}
          isSaved={isSaved}
          isError={isError}
        />
        {!isEmpty(results) && <Deploy path={directory} results={results} />}
      </div>
      <CodeEditor code={code} setCodeChange={setCodeChange} />
    </>
  );
};

interface CodeEditorWithSaveProps {
  id: string;
  directory: string;
  value: string;
}

export default CodeEditorWithSave;
