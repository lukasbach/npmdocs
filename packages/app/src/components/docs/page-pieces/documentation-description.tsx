import React, { FC, ReactNode } from "react";

import style from "./styles.module.css";
import { IBlock } from "@documentalist/client/lib/compiler";

export const DocumentationDescription: FC<{ block?: IBlock }> = ({ block }) => {
  if (!block) {
    return null;
  }
  return (
    <div className={style.description}>
      {block.contents.map((block, index) =>
        typeof block === "string" ? (
          <div
            key={index}
            dangerouslySetInnerHTML={{
              __html: block,
            }}
          />
        ) : (
          <div key={index} className={style.descriptionTagContainer}>
            <span className={style.descriptionTag}>
              {"{"}@{block.tag}
              {"}"}
            </span>{" "}
            {block.value}
          </div>
        )
      )}
    </div>
  );
};
