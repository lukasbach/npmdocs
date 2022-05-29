import React, { FC, ReactNode } from "react";
import { Portal } from "@reach/portal";
import * as popover from "@zag-js/popover";
import { useMachine, useSetup } from "@zag-js/react";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";
import "@reach/tabs/styles.css";
import { GeneralTab } from "./general-tab";
import { SearchTab } from "./search-tab";
import { HotkeysTab } from "./hotkeys-tab";

import style from "./styles.module.css";

export const SettingsButton: FC<{
  children: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => ReactNode;
}> = ({ children }) => {
  const [state, send] = useMachine(popover.machine({ portalled: true }));
  const ref = useSetup({ send, id: "1" });
  const api = popover.connect(state, send);

  return (
    <div ref={ref} className={style.settingsButtonContainer}>
      {children(api.triggerProps)}
      <Portal>
        <div {...api.positionerProps}>
          <Tabs>
            <div {...api.contentProps} className={style.container}>
              <div {...api.titleProps} className={style.title}>
                Settings
              </div>
              <TabList>
                <Tab>General</Tab>
                <Tab>Search</Tab>
                <Tab>Hotkeys</Tab>
              </TabList>
              <div {...api.descriptionProps} className={style.content}>
                <TabPanels>
                  <TabPanel>
                    <GeneralTab />
                  </TabPanel>
                  <TabPanel>
                    <SearchTab />
                  </TabPanel>
                  <TabPanel>
                    <HotkeysTab />
                  </TabPanel>
                </TabPanels>
              </div>
            </div>
          </Tabs>
        </div>
      </Portal>
    </div>
  );
};
