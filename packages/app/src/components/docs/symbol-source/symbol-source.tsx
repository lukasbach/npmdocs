import React, {
  FC,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTabsContext } from "@reach/tabs";
import { useWindowSize } from "react-use";
import { useDocs } from "../provider/use-docs";
import NProgress from "nprogress";
import { isDeclarationReflection } from "../../../common/guards";
import Editor from "@monaco-editor/react";
import { usePackageJson } from "../../../api/api-helpers";

export const SymbolSource: FC<{ tabIndex: number }> = ({ tabIndex }) => {
  const { packageName, encodedPackageName, version, symbolDocs } = useDocs();
  const packageJson = usePackageJson(encodedPackageName, version);
  const [code, setCode] = useState("");
  const { selectedIndex } = useTabsContext();
  const [top, setTop] = useState(0);
  const { height: windowHeight } = useWindowSize();
  const editorRef = useRef<any>(null);

  const isTabSelected = tabIndex === selectedIndex;
  const sourceFile =
    isDeclarationReflection(symbolDocs) && symbolDocs.sources?.[0];

  useEffect(() => {
    if (!packageName || !version || !sourceFile || !isTabSelected) {
      return;
    }
    NProgress.start();

    const typesBasePath = (
      packageJson?.data?.types ?? packageJson?.data?.typings
    )
      ?.split("/")
      .slice(0, -1)
      .join("/");

    if (!typesBasePath) {
      return;
    }

    fetch(
      `https://unpkg.com/${packageName}@${version}/${typesBasePath}/${sourceFile.fileName}`
    )
      .then(res => res.text())
      .then(code => {
        setCode(code);
        NProgress.done();
        setTimeout(() => {
          editorRef.current?.revealLinesNearTop(
            sourceFile.line,
            sourceFile.line
          );
          editorRef.current?.setSelection({
            startLineNumber: sourceFile.line,
            endLineNumber: sourceFile.line,
            startColumn: sourceFile.character,
            endColumn: code.split("\n")[sourceFile.line - 1].length,
          });
        });
      })
      .catch(e => {
        setCode("Error fetching code: " + e.message);
        NProgress.done();
      });
  }, [symbolDocs, packageName, version, isTabSelected]);

  const language = useMemo(() => {
    const extension = sourceFile?.fileName?.split(".").pop() ?? "text";
    switch (extension) {
      case "ts":
      case "tsx":
        return "typescript";
      case "js":
      case "jsx":
        return "javascript";
      default:
        return extension;
    }
  }, [sourceFile]);

  if (!isTabSelected) {
    return null;
  }

  return (
    <div
      ref={r => {
        setTop(r?.getBoundingClientRect()?.top ?? top);
      }}
    >
      <Editor
        height={windowHeight - top - 48}
        language={language}
        value={code}
        loading={code === ""}
        onMount={editor => {
          editorRef.current = editor;
        }}
        options={{
          readOnly: true,
        }}
      />
    </div>
  );
};
