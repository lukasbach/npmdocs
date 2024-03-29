import React, { FC, ReactNode, useState } from "react";
import { useRecentBuilds } from "../../../api/api-helpers";
import { ListContainer } from "../../common/list/list-container";
import { ListItem } from "../../common/list/list-item";

import style from "./styles.module.css";
import { usePackageSuggestions } from "../../../api/use-package-suggestions";
import { Footer } from "./footer";

export const StartPage: FC = () => {
  const [search, setSearch] = useState("");
  const recentBuilds = useRecentBuilds();
  const suggestions = usePackageSuggestions(search);
  return (
    <>
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
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {search === "" && (
            <div className={style.beta}>
              This project is in a beta state. Some packages may not build
              properly, and some types may render with issues. If you encounter
              issues, please{" "}
              <a
                href="https://github.com/lukasbach/npmdocs/issues/new/choose"
                target="_blank"
                rel="noreferrer"
              >
                report them as github issue
              </a>{" "}
              to support this project.
            </div>
          )}

          {search !== "" &&
            (suggestions?.length === 0 ? (
              <p>No search results...</p>
            ) : (
              <ListContainer>
                {suggestions?.map(({ name, scope, version }) => (
                  <ListItem
                    key={`${name}___${version}`}
                    right={version}
                    href={`${name.replace("/", "__")}/${version}`}
                  >
                    {name}
                  </ListItem>
                ))}
              </ListContainer>
            ))}

          {search === "" && recentBuilds.data && (
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
      <Footer />
    </>
  );
};
