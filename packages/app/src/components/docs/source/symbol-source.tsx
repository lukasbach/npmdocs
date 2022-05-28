import React, {
  FC,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTabsContext } from "@reach/tabs";
import { useDocs } from "../provider/use-docs";
import NProgress from "nprogress";
import { isDeclarationReflection } from "@lukasbach/npmdocs-typedoc-utils";
import { usePackageJson } from "../../../api/api-helpers";
import { DocsEditor } from "./docs-editor";

export const SymbolSource: FC<{ tabIndex: number }> = ({ tabIndex }) => {
  const { packageName, encodedPackageName, version, symbolDocs } = useDocs();
  const packageJson = usePackageJson(encodedPackageName, version);
  const [code, setCode] = useState("");
  const { selectedIndex } = useTabsContext();

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

    fetch(
      `https://unpkg.com/${packageName}@${version}/${typesBasePath}/${sourceFile.fileName}`
    )
      .then(res => res.text())
      .then(code => {
        setCode(code);
        NProgress.done();
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
    <DocsEditor
      code={code}
      language={language}
      onDone={editor => {
        editor.revealLinesNearTop(sourceFile.line, sourceFile.line);
        editor.setSelection({
          startLineNumber: sourceFile.line,
          endLineNumber: sourceFile.line,
          startColumn: sourceFile.character,
          endColumn: code.split("\n")[sourceFile.line - 1]?.length,
        });
      }}
    />
  );
};
