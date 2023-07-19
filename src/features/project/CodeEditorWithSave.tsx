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

const CodeEditorWithSave: FC<CodeEditorWithSaveProps> = ({
  id,
  value,
  directory,
}) => {
  const { webcontainerPath, path } = directory;
  const changedField = useAppSelector((state) =>
    selectChangedField(state, webcontainerPath)
  );
  const dispatch = useAppDispatch();
  const [code, setCode] = useState<string | undefined>("");
  const webcontainerInstance = useAppSelector(selectWebcontainerInstance);
  const [updateFileTree, { isLoading, isError }] = useUpdateFileTreeMutation();

  const setCodeChange = async (code: string | undefined) => {
    if (!code) return;
    setCode(code);
    dispatch(setChangedFields({ location: webcontainerPath, code }));
  };

  useEffect(() => {
    const changedStoredCode = changedField?.code;
    setCode(changedStoredCode || value);
  }, []);

  const isSaved = changedField?.saved;

  const save = async () => {
    try {
      await updateFileTree({
        id: id,
        body: { location: webcontainerPath, code },
      }).unwrap();
      dispatch(
        setChangedFieldStatus({
          location: webcontainerPath,
          saved: true,
        })
      );
      webcontainerInstance?.fs.writeFile(path.replace(/\*/g, "."), code || "");
    } catch {}
  };

  return (
    <>
      <div className="flex items-center p-2">
        <SaveCode
          disabled={!changedField}
          onClick={save}
          isLoading={isLoading}
          isSaved={isSaved}
          isError={isError}
        />
      </div>
      <CodeEditor code={code} setCodeChange={setCodeChange} />
    </>
  );
};

interface CodeEditorWithSaveProps {
  id: string;
  directory: { path: string; webcontainerPath: string };
  value: string;
}

export default CodeEditorWithSave;
