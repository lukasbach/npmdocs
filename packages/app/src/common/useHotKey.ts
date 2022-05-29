import { useKey } from "react-use";
import { useCallback } from "react";

const interactiveElements = [
  "input",
  "textarea",
  "select",
  "button",
  "a",
  "area",
  "iframe",
  "object",
  "embed",
  "video",
  "audio",
  "canvas",
  "script",
  "style",
];

export const useHotKey: typeof useKey = (key, fn, opts, deps) => {
  useKey(
    key,
    useCallback(
      e => {
        if (
          interactiveElements.includes(
            (e.target as HTMLElement).tagName.toLowerCase()
          )
        ) {
          return;
        }
        fn(e);
      },
      [fn]
    ),
    opts,
    deps
  );
};
