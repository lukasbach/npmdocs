import React, { FC, ReactNode } from "react";

import style from "./styles.module.css";
import Link from "next/link";

export const ListItem: FC<{
  children: ReactNode;
  right?: ReactNode;
  href?: string;
}> = ({ children, right, href }) => {
  const content = (
    <li className={style.item}>
      <div className={style.itemContent}>{children}</div>
      {right && <div className={style.itemRight}>{right}</div>}
    </li>
  );

  if (href) {
    return (
      <Link href={href}>
        <a>{content}</a>
      </Link>
    );
  } else {
    return content;
  }
};
