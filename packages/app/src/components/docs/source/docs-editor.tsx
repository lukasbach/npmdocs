import React, { FC, useEffect, useRef, useState } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { useWindowSize } from "react-use";
import { useSettings } from "../../settings/use-settings";

export const DocsEditor: FC<{
  code: string;
  language: string;
  onDone?: OnMount;
}> = ({ code, onDone, language }) => {
  const [top, setTop] = useState(0);
  const { height: windowHeight } = useWindowSize();
  const editorRef = useRef<any>();
  const monacoRef = useRef<any>();
  const { darkMode } = useSettings();

  useEffect(() => {
    if (monacoRef.current && editorRef.current) {
      onDone?.(editorRef.current, monacoRef.current);
    }
  }, [code, onDone]);

  return (
    <div
      ref={r => {
        setTop(r?.getBoundingClientRect()?.top ?? top);
      }}
    >
      {code && code !== "" && (
        <Editor
          height={windowHeight - top - 48}
          language={language}
          value={code}
          theme={darkMode ? "vs-dark" : "vs-light"}
          onMount={(editor, monaco) => {
            editorRef.current = editor;
            monacoRef.current = monaco;
            onDone?.(editor, monaco);
          }}
          options={{
            readOnly: true,
          }}
        />
      )}
    </div>
  );
};
