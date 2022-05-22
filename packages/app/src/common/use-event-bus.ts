import { useCallback, useEffect, useRef } from "react";

type Listener<T> = (data?: T) => void;

const listeners: Record<string, Listener<any>[]> = {};

export const useEventBus = <T = undefined>(
  event: string,
  listener?: Listener<T>
) => {
  const listenerRef = useRef(listener);
  const stableListener = useCallback((e: any) => {
    listenerRef.current?.(e);
  }, []);

  useEffect(() => {
    if (!listeners[event]) {
      listeners[event] = [];
    }
    listeners[event].push(stableListener);
    return () => {
      listeners[event].splice(listeners[event].indexOf(stableListener), 1);
    };
  });

  listenerRef.current = listener;

  return useCallback((data?: T) => {
    listeners[event]?.forEach(listener => listener(data));
  }, []);
};
