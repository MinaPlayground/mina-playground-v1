import { ItemType } from "@/types";
import * as React from "react";
import { Deploy } from "@/features/deploy/Deploy";

export const mapTypeToCustomComponent = (type: ItemType) => {
  switch (type) {
    case "deploy":
      return <Deploy />;
  }
};
