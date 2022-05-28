import React, { FC } from "react";
import { useDocs } from "../provider/use-docs";
import { Comment } from "../page-pieces/comment";
import {
  isContainerReflection,
  isProject,
} from "@lukasbach/npmdocs-typedoc-utils";
import { OverviewGroup } from "./overview-group";
import { ProjectHeader } from "./project-header";

import style from "./styles.module.css";

export const Overview: FC = () => {
  const { symbolDocs } = useDocs();
  return (
    <div>
      {isProject(symbolDocs) && <ProjectHeader />}

      <Comment comment={symbolDocs.comment} />

      {isContainerReflection(symbolDocs) &&
        symbolDocs.groups.map(group => (
          <OverviewGroup group={group} key={group.title} />
        ))}
    </div>
  );
};
