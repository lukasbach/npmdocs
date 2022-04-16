import * as React from "react";
import { Header } from "../common/header/header";
import { HeaderButton } from "../common/header/header-button";
import { HeaderListButton } from "../common/header/header-list-button";
import { ColormodeButton } from "../common/header/colormode-button";
import { usePackageVersions } from "../../api/api-helpers";
import { IoPricetagOutline, IoPricetagSharp } from "react-icons/io5";

export const DocsHeader: React.FC<{
  packageName: string;
  packageVersion: string;
}> = props => {
  const { data: versions, error } = usePackageVersions(props.packageName);
  return (
    <Header>
      <HeaderButton text="Regular Button" />
      <HeaderButton text="Regular Button" />
      {versions && (
        <HeaderButton text="Versions">
          {Object.entries(versions).map(([version, { time, built }]) => (
            <HeaderListButton
              key={version}
              href={`/${props.packageName}/${version}`}
            >
              {built ? (
                <IoPricetagSharp title="Documentation is built for this version" />
              ) : (
                <IoPricetagOutline title="Version has not been built yet" />
              )}
              {version}
            </HeaderListButton>
          ))}
        </HeaderButton>
      )}
      <HeaderButton text="Regular Button">
        <HeaderListButton>Repository</HeaderListButton>
        <HeaderListButton>Author</HeaderListButton>
        <HeaderListButton>Something</HeaderListButton>
        <HeaderListButton>Else</HeaderListButton>
      </HeaderButton>
      <ColormodeButton />
    </Header>
  );
};
