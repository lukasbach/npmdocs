import React, { FC } from "react";
import { useTriggerRedirect } from "../../../src/common/use-trigger-redirect";

const Page: FC = () => {
  useTriggerRedirect();
  return (
    <div>
      <h1>Page</h1>
    </div>
  );
};

export default Page;
