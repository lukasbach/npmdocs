import React, { FC, ReactNode } from "react";
import { JSONOutput } from "typedoc";
import { isContainerReflection } from "../../../common/guards";
import { useDocs } from "../provider/use-docs";
import { OverviewItem } from "./overview-item";

import style from "./styles.module.css";

export const OverviewGroup: FC<{ group: JSONOutput.ReflectionGroup }> = ({
  group,
}) => {
  const { symbolDocs } = useDocs();
  return (
    <>
      <h2 className={style.title}>{group.title}</h2>
      <ul className={style.list}>
        {group.children.map(childId => {
          const item =
            isContainerReflection(symbolDocs) &&
            symbolDocs.children.find(child => child.id === childId);

          if (!item) {
            return null;
          }

          return <OverviewItem key={childId} item={item} />;
        })}
      </ul>
    </>
  );
};
