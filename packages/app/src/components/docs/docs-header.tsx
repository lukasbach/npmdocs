import * as React from "react";
import { Header } from "../common/header/header";
import { HeaderButton } from "../common/header/header-button";
import { HeaderListButton } from "../common/header/header-list-button";
import { useAboutPackage, usePackageVersions } from "../../api/api-helpers";
import {
  IoPricetagOutline,
  IoPricetagSharp,
  IoCubeOutline,
  IoCheckmark,
} from "react-icons/io5";
import { HeaderExpander } from "../common/header/header-expander";
import { usePkgQuery } from "../../common/use-pkg-query";
import { HeaderRight } from "../shared/header/header-right";
import { HeaderLeft } from "../shared/header/header-left";
import { ExternalLinks } from "./external-links";

export const DocsHeader: React.FC<{}> = props => {
  const { version, encodedPackageName, packageName } = usePkgQuery();
  const { data: versions } = usePackageVersions(encodedPackageName);
  const { data: about } = useAboutPackage(encodedPackageName);

  return (
    <Header>
      <HeaderLeft />
      <HeaderButton
        text={
          <>
            <IoCubeOutline /> {packageName}
          </>
        }
      />
      {versions && (
        <HeaderButton text={version ? `@${version}` : "Choose a version"}>
          {Object.entries(versions).map(([v, { time, built }]) => (
            <HeaderListButton key={v} href={`/${encodedPackageName}/${v}`}>
              {v === version ? <IoPricetagSharp /> : <IoPricetagOutline />}
              {v}
              {built && (
                <>
                  {" "}
                  <IoCheckmark title="Documentation is built for this version" />
                </>
              )}
            </HeaderListButton>
          ))}
        </HeaderButton>
      )}
      <ExternalLinks />
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
      <HeaderRight />
    </Header>
  );
};
