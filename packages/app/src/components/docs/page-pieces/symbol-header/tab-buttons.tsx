import React, { FC, ReactNode, useState } from "react";

import style from "./styles.module.css";
import {
  IoCheckmark,
  IoClipboardOutline,
  IoOptionsOutline,
  IoSearchSharp,
  IoSettingsOutline,
  IoChevronUpOutline,
  IoChevronDownOutline,
} from "react-icons/io5";
import { useSettings } from "../../../settings/use-settings";
import { useEventBus } from "../../../../common/use-event-bus";
import { useCopyToClipboard } from "react-use";

export const TabButtons: FC = () => {
  const onOpenSearch = useEventBus("search");
  const onToggleExpandedItems = useEventBus<boolean>("toggle-expanded-items");
  const { defaultExpandAccordions } = useSettings();
  const [allExpanded, setAllExpanded] = useState(defaultExpandAccordions);
  const [, copyToClipboard] = useCopyToClipboard();
  const [hasCopied, setHasCopied] = useState(false);

  return (
    <>
      <button
        className={style.tabsButton}
        onClick={() => {
          copyToClipboard(location.href);
          setHasCopied(true);
          setTimeout(() => setHasCopied(false), 1000);
        }}
      >
        {hasCopied ? <IoCheckmark /> : <IoClipboardOutline />}
      </button>
      <button className={style.tabsButton} onClick={onOpenSearch}>
        <IoSearchSharp />
      </button>
      <button
        className={style.tabsButton}
        onClick={() => {
          onToggleExpandedItems(!allExpanded);
          setAllExpanded(!allExpanded);
        }}
      >
        {allExpanded ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
      </button>
    </>
  );
};
