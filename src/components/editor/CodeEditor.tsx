import { FC, useCallback } from "react";
import Editor from "@monaco-editor/react";
import {
  getWorker,
  MonacoJsxSyntaxHighlight,
} from "monaco-jsx-syntax-highlight";
import Loader from "@/components/Loader";

const CodeEditor: FC<CodeEditorProps> = ({ code, setCodeChange }) => {
  const handleEditorDidMount = useCallback((editor: any, monaco: any) => {
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.Preserve,
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      esModuleInterop: true,
    });

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });

    const monacoJsxSyntaxHighlight = new MonacoJsxSyntaxHighlight(
      getWorker(),
      monaco
    );

    const { highlighter, dispose } =
      monacoJsxSyntaxHighlight.highlighterBuilder({
        editor: editor,
      });

    highlighter();

    editor.onDidChangeModelContent(() => {
      highlighter();
    });

    return dispose;
  }, []);

  const setEditorTheme = (monaco: any) => {
    monaco.editor.defineTheme("dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#202123",
      },
    });
  };

  return (
    <Editor
      className="editor max-lg:h-[400px]"
      path={"file:///index.tsx"}
      defaultLanguage="typescript"
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
}

export default CodeEditor;
