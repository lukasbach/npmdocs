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

const getTypePrefix = (
  typesVersions?: Record<
    string,
    Record<string, string[] | undefined> | undefined
  >
) => {
  return typesVersions &&
    Object.keys(Object.values(typesVersions)[0] ?? {})[0] === "*"
    ? Object.values(Object.values(typesVersions)?.[0] ?? {})?.[0]?.[0]?.slice(
        0,
        -1
      ) ?? ""
    : "";
};

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
      getTypePrefix(packageJson.data.typesVersions) +
      (packageJson?.data?.types ?? packageJson?.data?.typings)
    )
      ?.split("/")
      .slice(0, -1)
      .join("/");

    const url = `https://unpkg.com/${packageName}@${version}/${typesBasePath}/${sourceFile.fileName}`;
    const altUrl = `https://unpkg.com/${packageName}@${version}/${sourceFile.fileName}`;

    fetch(url)
      .catch(() => fetch(altUrl))
      .then(res => (!res.ok ? fetch(altUrl) : res))
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
        try {
          editor.revealLinesNearTop(sourceFile.line, sourceFile.line);
          editor.setSelection({
            startLineNumber: sourceFile.line,
            endLineNumber: sourceFile.line,
            startColumn: sourceFile.character,
            endColumn: code.split("\n")[sourceFile.line - 1]?.length,
          });
        } catch (e) {
          console.error("Could not set editor selection", e);
        }
      }}
    />
  );
};
