import * as React from "react";
import { Header } from "../common/header/header";
import { HeaderButton } from "../common/header/header-button";
import { HeaderListButton } from "../common/header/header-list-button";
import { ColormodeButton } from "../common/header/colormode-button";
import { useAboutPackage, usePackageVersions } from "../../api/api-helpers";
import {
  IoPricetagOutline,
  IoPricetagSharp,
  IoCubeOutline,
  IoLibrarySharp,
} from "react-icons/io5";
import { HeaderExpander } from "../common/header/header-expander";

export const DocsHeader: React.FC<{
  packageName: string;
  packageVersion: string;
}> = props => {
  const { data: versions, error } = usePackageVersions(props.packageName);
  const { data: about } = useAboutPackage(props.packageName);
  return (
    <Header>
      <HeaderButton
        text={
          <>
            <IoLibrarySharp /> npmdocs
          </>
        }
      />
      <HeaderButton
        text={
          <>
            <IoCubeOutline /> {props.packageName}
          </>
        }
      />
      {versions && (
        <HeaderButton text={`@${props.packageVersion}`}>
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
      <HeaderButton text="External Links">
        <HeaderListButton>Repository</HeaderListButton>
        <HeaderListButton>Bugs</HeaderListButton>
        <HeaderListButton>NPM Page</HeaderListButton>
        <HeaderListButton>Homepage</HeaderListButton>
      </HeaderButton>
      {about?.maintainers?.length && (
        <HeaderButton text="Maintainers">
          {about.maintainers.map(({ name, email }) => (
            <HeaderListButton key={name} href={`mailto:${email}`}>
              {name}
            </HeaderListButton>
          ))}
        </HeaderButton>
      )}
      <HeaderExpander />
      <HeaderButton text="@lukasbach" />
      <ColormodeButton />
    </Header>
  );
};
