import React, {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
} from "react";
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

  useEffect(() => {
    document.body.classList.add(settings.darkMode ? "dark" : "light");
  }, []);

  const completeSettings = useMemo(
    () => ({
      ...defaultSettings,
      ...settings,
      update: (partial: Partial<Settings>) => {
        const updated = { ...settingsRef.current, ...partial };
        update(updated);

        const prevMode = settingsRef.current.darkMode ? "dark" : "light";
        const newMode = updated.darkMode ? "dark" : "light";
        if (prevMode !== newMode) {
          document.body.classList.remove(prevMode);
          document.body.classList.add(newMode);
        }
      },
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
