import React, { FC, ReactNode, useMemo } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

export const Markdown: FC<{ markdown?: string }> = ({ markdown }) => {
  const html = useMemo(
    () => markdown && DOMPurify.sanitize(marked(markdown)),
    [markdown]
  );
  return html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null;
};
