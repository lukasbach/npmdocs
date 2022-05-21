import React, { FC, useEffect, useMemo, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vs } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { useHash } from "../../common/use-hash";
import { usePkgQuery } from "../../common/use-pkg-query";
import NProgress from "nprogress";

import style from "./styles.module.css";

export const CodeView: FC = () => {
  const hash = useHash();
  const { packageName, version } = usePkgQuery();
  const [code, setCode] = useState("");

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
    <div>
      <div className={style.breadcrumbs}>
        {packageName}@{version}
        {hash}
      </div>
      <SyntaxHighlighter language={language} style={vs} showLineNumbers={true}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
};
