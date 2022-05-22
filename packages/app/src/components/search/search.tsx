import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { Dialog } from "@reach/dialog";
import { useKey } from "react-use";
import { useSearchResults } from "./use-search-results";
import { SearchItem } from "./search-item";
import { useEventBus } from "../../common/use-event-bus";

import "@reach/dialog/styles.css";
import style from "./styles.module.css";

export const Search: FC = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const containerRef = useRef<HTMLDivElement>();
  const inputRef = useRef<HTMLInputElement>();
  const listRef = useRef<HTMLUListElement>();

  const onOpen = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    setShowDialog(true);
  }, []);

  const onClose = useCallback(() => {
    setShowDialog(false);
    setSearchValue("");
  }, []);

  useKey(".", onOpen);
  useKey("f1", onOpen);

  useKey("ArrowUp", () => {
    if (!containerRef.current?.contains(document.activeElement)) {
      return;
    }

    if (listRef.current.contains(document.activeElement)) {
      if (!document.activeElement.previousSibling) {
        inputRef.current?.focus();
      } else {
        (document.activeElement.previousSibling as HTMLElement)?.focus();
      }
    }
  });

  useKey("ArrowDown", () => {
    if (!containerRef.current?.contains(document.activeElement)) {
      return;
    }

    if (listRef.current.contains(document.activeElement)) {
      (document.activeElement.nextSibling as HTMLElement)?.focus();
    } else if (inputRef.current === document.activeElement) {
      (listRef.current.children.item(0) as HTMLElement)?.focus();
    }
  });

  useKey("Enter", () => {
    if (inputRef.current === document.activeElement) {
      (listRef.current.children.item(0) as HTMLElement)?.click();
    }
  });

  useEventBus("search", onOpen);

  useEffect(() => inputRef.current?.focus(), []);
  const searchResults = useSearchResults(searchValue);

  return (
    <Dialog
      isOpen={showDialog}
      onDismiss={onClose}
      className={style.dialog}
      ref={containerRef}
    >
      <input
        placeholder="Search for a symbol..."
        className={style.input}
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
        ref={inputRef}
      />
      <ul ref={listRef} className={style.list}>
        {searchResults.map(result => (
          <SearchItem id={result} key={result} onSelect={onClose} />
        ))}
      </ul>
    </Dialog>
  );
};
