import React, { useState, FC, useEffect, useRef } from "react";
import { usePopper } from "react-popper";
import { IoSearch } from "react-icons/io5";
import { Menu, MenuItem, MenuImperativeHandle } from "react-accessible-menu";
import { HeaderListButton } from "./header-list-button";

import style from "./styles.module.css";

export const HeaderInput: FC<{
  placeholder: string;
  onChange: (value: string) => void;
  suggestions: { title: string; href: string }[];
}> = ({ placeholder, suggestions, onChange }) => {
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {});
  const menuRef = useRef<MenuImperativeHandle>();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        isOpen &&
        e.target !== referenceElement &&
        e.target !== popperElement &&
        !(popperElement as any)?.contains(e.target) &&
        !referenceElement?.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, [isOpen, referenceElement, popperElement]);

  return (
    <div className={style.headerInputContainer}>
      <IoSearch />
      <input
        placeholder={placeholder}
        ref={setReferenceElement}
        onFocus={() => {
          setIsOpen(true);
        }}
        className={style.headerInput}
        onChange={e => {
          onChange(e.target.value);
        }}
        onKeyDown={e => {
          if (e.key === "ArrowDown") {
            menuRef.current.focusItem(0);
            popperElement?.querySelector("a")?.focus();
          }
        }}
      />

      {isOpen && (
        <div
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          <Menu
            ref={menuRef}
            renderMenu={({ props, ref }) => (
              <div className={style.headerList} ref={ref} {...props}>
                {!suggestions?.length && (
                  <HeaderListButton>
                    Start typing for suggestions...
                  </HeaderListButton>
                )}
                {suggestions.map(suggestion => (
                  <MenuItem<HTMLButtonElement>
                    key={suggestion.title}
                    renderItem={({ props, ref }) => (
                      <HeaderListButton
                        {...props}
                        ref={ref}
                        href={suggestion.href}
                        data-suggestion={true}
                      >
                        {suggestion.title}
                      </HeaderListButton>
                    )}
                  />
                ))}
              </div>
            )}
          />
        </div>
      )}
    </div>
  );
};
