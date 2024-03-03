import { ChangeEvent, FC, useCallback } from "react";
import Editor from "@monaco-editor/react";
import Loader from "@/components/Loader";
import dracula from "@/styles/dracula.json";

const CodeEditor: FC<CodeEditorProps> = ({ code, setCodeChange, onBlur }) => {
  const handleEditorDidMount = useCallback((editor: any, monaco: any) => {
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });
  }, []);

  const setEditorTheme = (monaco: any) => {
    monaco.editor.defineTheme("dark", dracula);
  };

  return (
    <Editor
      className="editor max-lg:h-[300px]"
      language={"typescript"}
      value={code}
      theme="dark"
      loading={
        <Loader
          text="Loading"
          circleColor={"text-white"}
          spinnerColor={"fill-black"}
        />
      }
      onChange={(value) => setCodeChange(value)}
      onMount={handleEditorDidMount}
      beforeMount={setEditorTheme}
      options={editorOptions}
      wrapperProps={{
        onBlur: (event: ChangeEvent<HTMLInputElement>) => {
          if (onBlur) onBlur(code);
        },
      }}
    />
  );
};

const editorOptions = {
  fontSize: 12,
  minimap: { enabled: false },
  formatOnPaste: true,
  lineHeight: 20,
  automaticLayout: true,
};

interface CodeEditorProps {
  code: string | undefined;
  setCodeChange(value: string | undefined): void;
  onBlur?(value: string | undefined): void;
}

export default CodeEditor;
