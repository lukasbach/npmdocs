import React, { createContext, FC, ReactNode, useMemo, useRef } from "react";
import { useAsyncRetry, useLocalStorage, useThrottle } from "react-use";
import { Settings } from "./types";

const defaultSettings: Settings = {
  darkMode: false,
  containerWidth: 1000,
  sortEnumsByValue: false,
  hideInheritedMembers: false,
  defaultExpandAccordions: false,
  hideFlagsInLists: false,
  searchOmitChildren: false,
  searchCheckCase: false,
  searchCheckFullPath: false,
  searchListCount: 20,
};

export const SettingsContext = createContext<
  Settings & { update: (settings: Partial<Settings>) => void }
>({
  ...defaultSettings,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  update: () => {},
});

export const SettingsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, update] = useLocalStorage<Partial<Settings>>("settings", {});
  const settingsRef = useRef(settings);
  // const throttledSettings = useThrottle(settings, 500);
  const completeSettings = useMemo(
    () => ({
      ...defaultSettings,
      ...settings,
      update: partial => update({ ...settingsRef.current, ...partial }),
    }),
    [settings]
  );

  settingsRef.current = settings;

  return (
    <SettingsContext.Provider value={completeSettings}>
      {children}
    </SettingsContext.Provider>
  );
};
