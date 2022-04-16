import React, { useState, FC, useEffect } from "react";
import { usePopper } from "react-popper";
import { IoChevronDownSharp } from "react-icons/io5";

import style from "./styles.module.css";

export const HeaderButton: FC<{
  children?: React.ReactNode;
  text: string | React.ReactNode;
  onClick?: () => void;
  href?: string;
}> = props => {
  const hasPopover = !!props.children;
  const Component = props.href ? "a" : "button";

  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {});

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        isOpen &&
        e.target !== referenceElement &&
        e.target !== popperElement &&
        !popperElement?.contains(e.target)
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
    <>
      <Component
        href={props.href}
        ref={hasPopover ? setReferenceElement : null}
        onClick={() => {
          setIsOpen(!isOpen);
          props.onClick?.();
        }}
        className={style.headerBtn}
      >
        {props.text}
        {hasPopover && <IoChevronDownSharp />}
      </Component>

      {hasPopover && isOpen && (
        <div
          ref={setPopperElement}
          style={styles.popper}
          className={style.headerList}
          {...attributes.popper}
        >
          {props.children}
        </div>
      )}
    </>
  );
};
