import { SettingsContext } from "./settings-provider";
import { useContext } from "react";

export const useSettings = () => useContext(SettingsContext);
