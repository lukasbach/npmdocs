import React, { FC } from "react";
import { useDocs } from "../../docs/provider/use-docs";
import { ListContainer } from "../../common/list/list-container";
import { usePackageVersions } from "../../../api/api-helpers";
import { ListItem } from "../../common/list/list-item";

export const VersionsPage: FC<{}> = () => {
  const { packageName, encodedPackageName } = useDocs();
  const { data } = usePackageVersions(encodedPackageName);
  return (
    <div>
      <h1>{packageName} Versions</h1>
      <ListContainer>
        {data &&
          Object.entries(data).map(([version, { time, built }]) => (
            <ListItem
              key={version}
              href={`/${encodedPackageName}/${version}`}
              right={
                <>
                  {built && <>(Version is already built) </>}
                  {new Date(time).toLocaleDateString()}
                </>
              }
            >
              {version}
            </ListItem>
          ))}
      </ListContainer>
    </div>
  );
};
