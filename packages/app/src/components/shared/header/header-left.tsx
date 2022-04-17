import React, { FC, ReactNode } from "react";
import { HeaderButton } from "../../common/header/header-button";
import { IoLibrarySharp } from "react-icons/io5";

export const HeaderLeft: FC = () => {
  return (
    <>
      <HeaderButton
        href="/"
        text={
          <>
            <IoLibrarySharp /> npmdocs
          </>
        }
      />
    </>
  );
};
