import React, { FC, ReactNode } from "react";
import { useRecentBuilds } from "../../../api/api-helpers";
import { ListContainer } from "../../common/list/list-container";
import { ListItem } from "../../common/list/list-item";

import style from "./styles.module.css";

export const StartPage: FC = () => {
  const recentBuilds = useRecentBuilds();
  return (
    <div className={style.container}>
      <div className={style.inner}>
        <h1 className={style.title}>npmdocs</h1>
        <p className={style.description}>
          A comprehensive documentation of all packages on npm
        </p>
        <div>
          <input
            className={style.search}
            placeholder="Search for packages..."
          />
        </div>

        {recentBuilds.data && (
          <>
            <h2 className={style.h2}>Recently built documentations</h2>
            <ListContainer>
              {recentBuilds.data.map(({ packageName, version }) => (
                <ListItem
                  key={`${packageName}___${version}`}
                  right={version}
                  href={`${packageName.replace("/", "__")}/${version}`}
                >
                  {packageName}
                </ListItem>
              ))}
            </ListContainer>
          </>
        )}
      </div>
    </div>
  );
};
