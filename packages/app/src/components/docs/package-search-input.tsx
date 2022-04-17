import React, { FC, useMemo, useState } from "react";
import { usePackageSuggestions } from "../../api/use-package-suggestions";
import { HeaderInput } from "../common/header/header-input";

export const PackageSearchInput: FC = () => {
  const [value, setValue] = useState("");
  const suggestions = usePackageSuggestions(value);

  const mappedSuggestions = useMemo(() => {
    return (
      suggestions?.map(suggestion => ({
        title: suggestion.name,
        href: `/packages/${suggestion.name.replace("/", "__")}`,
      })) ?? []
    );
  }, [suggestions]);

  return (
    <HeaderInput
      placeholder="Search packages on NPM..."
      onChange={setValue}
      suggestions={mappedSuggestions}
    />
  );
};
