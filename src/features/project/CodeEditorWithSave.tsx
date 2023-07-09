import { FC, useEffect, useState } from "react";
import { FileSystemTree } from "@webcontainer/api";
import CodeEditor from "@/components/editor/CodeEditor";
import SaveCode from "@/components/editor/SaveCode";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectWebcontainerInstance } from "@/features/webcontainer/webcontainerSlice";
import { useUpdateFileTreeMutation } from "@/services/fileTree";
import { selectCurrentTreeItem } from "@/features/fileTree/fileTreeSlice";

const CodeEditorWithSave: FC<CodeEditorWithSaveProps> = ({ id }) => {
  const { currentDirectory: directory, code: treeItemCode } = useAppSelector(
    selectCurrentTreeItem
  );

  const [code, setCode] = useState<string | undefined>("");
  const [changedFields, setChangedFields] = useState({});
  const webcontainerInstance = useAppSelector(selectWebcontainerInstance);
  const [updateFileTree, { isLoading }] = useUpdateFileTreeMutation();

  const setCodeChange = async (code: string | undefined) => {
    if (!code) return;
    setChangedFields({
      ...changedFields,
      [directory.webcontainerPath]: code,
    });
    setCode(code);
  };

  useEffect(() => {
    setCode(treeItemCode);
  }, [treeItemCode]);

  const notSaved = directory.webcontainerPath in changedFields;

  const save = async () => {
    const body = { location: directory.webcontainerPath, code };
    updateFileTree({
      id: id,
      body,
    });
    webcontainerInstance?.fs.writeFile(
      directory.path.replace(/\*/g, "."),
      code || ""
    );
  };
  return (
    <>
      {/*<svg width="16" height="16" fill="none" aria-hidden="true">*/}
      {/*  <path d="M4 12L12 4M12 12L4 4"></path>*/}
      {/*  <circle cx="8" cy="8" r="4"></circle>*/}
      {/*</svg>*/}
      <CodeEditor code={code} setCodeChange={setCodeChange} />
    </>
  );
};

interface CodeEditorWithSaveProps {
  id: string;
}

export default CodeEditorWithSave;
