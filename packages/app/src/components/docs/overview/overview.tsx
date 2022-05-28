import React, { FC, ReactNode } from "react";
import { useDocs } from "../provider/use-docs";

import style from "./styles.module.css";
import { Comment } from "../page-pieces/comment";
import { isContainerReflection } from "../../../common/guards";
import { SymbolGroup } from "../page-pieces/symbol-group";
import { OverviewGroup } from "./overview-group";

export const Overview: FC = () => {
  const { symbolDocs } = useDocs();
  return (
    <div>
      <Comment comment={symbolDocs.comment} />

      {isContainerReflection(symbolDocs) &&
        symbolDocs.groups.map(group => (
          <OverviewGroup group={group} key={group.title} />
        ))}
    </div>
  );
};
