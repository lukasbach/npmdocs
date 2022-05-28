import React, { FC } from "react";
import type { JSONOutput } from "typedoc";

import style from "./styles.module.css";
import Link from "next/link";
import { useDocs } from "../provider/use-docs";

export const OverviewItem: FC<{ item: JSONOutput.DeclarationReflection }> = ({
  item: { name },
}) => {
  const { getRouteInNamespace } = useDocs();
  return (
    <li className={style.item}>
      {" "}
      <Link href={getRouteInNamespace(name)}>
        <a className={style.link}>{name}</a>
      </Link>
    </li>
  );
};
