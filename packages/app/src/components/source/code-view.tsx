import React, { FC, useEffect, useMemo, useState } from "react";
import { useHash } from "../../common/use-hash";
import { usePkgQuery } from "../../common/use-pkg-query";
import Editor from "@monaco-editor/react";
import NProgress from "nprogress";

import style from "./styles.module.css";
import { useMeasure } from "react-use";
import { useSettings } from "../settings/use-settings";

export const CodeView: FC = () => {
  const hash = useHash();
  const { packageName, version } = usePkgQuery();
  const [code, setCode] = useState("");
  const [containerRef, { height }] = useMeasure();
  const { darkMode } = useSettings();

  useEffect(() => {
    if (!packageName || !version || !hash) {
      return;
    }
    NProgress.start();

    fetch(`https://unpkg.com/${packageName}@${version}/${hash}`)
      .then(res => res.text())
      .then(code => {
        setCode(code);
        NProgress.done();
      })
      .catch(e => {
        setCode("Error fetching code: " + e.message);
        NProgress.done();
      });
  }, [hash, packageName, version]);

  const language = useMemo(() => {
    const extension = hash?.split(".").pop() ?? "text";
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
  }, [hash]);

  return (
    <div className={style.container}>
      <div className={style.breadcrumbs}>
        {packageName}@{version}
        {hash}
      </div>
      <div className={style.editorContainer} ref={containerRef}>
        <Editor
          height={height}
          language={language}
          value={code}
          theme={darkMode ? "vs-dark" : "vs-light"}
          loading={code === ""}
          options={{
            readOnly: true,
          }}
        />
      </div>
    </div>
  );
};
