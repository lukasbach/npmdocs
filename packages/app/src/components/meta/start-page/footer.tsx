import React from "react";

import style from "./styles.module.css";

export const Footer = () => (
  <div className={style.footer}>
    Build by{" "}
    <a href="https://github.com/lukasbach" target="_blank" rel="noreferrer">
      Lukas Bach
    </a>
    . If you enjoy using this tool, please{" "}
    <a
      href="https://github.com/lukasbach/npmdocs"
      target="_blank"
      rel="noreferrer"
    >
      give it a star on Github
    </a>
    .
  </div>
);
