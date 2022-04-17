import React, { FC } from "react";
import { Header } from "../common/header/header";
import { HeaderLeft } from "../shared/header/header-left";
import { HeaderExpander } from "../common/header/header-expander";
import { HeaderRight } from "../shared/header/header-right";

export const MetaHeader: FC = () => {
  return (
    <Header>
      <HeaderLeft />
      <HeaderExpander />
      <HeaderRight />
    </Header>
  );
};
