import React, { FC, ReactNode } from "react";
import { useLookedUpItem } from "../../common/use-looked-up-item";

import style from "./styles.module.css";
import Link from "next/link";
import { useDocs } from "../docs/provider/use-docs";

export const SearchItem: FC<{ id: number; onSelect: () => void }> = ({
  id,
  onSelect,
}) => {
  const { docsBaseUrl } = useDocs();
  const { targetUrl } = useLookedUpItem(id);
  return (
    <Link href={`/${docsBaseUrl}#${targetUrl}`}>
      <a onClick={onSelect} className={style.itemButton}>
        <li className={style.itemListItem}>{targetUrl}</li>
      </a>
    </Link>
  );
};
