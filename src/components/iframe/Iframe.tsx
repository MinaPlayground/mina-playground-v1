import { useAppSelector } from "@/hooks/useAppSelector";
import { selectServerUrl } from "@/features/webcontainer/webcontainerSlice";
import * as React from "react";
import { FC } from "react";

const Iframe: FC = () => {
  const serverUrl = useAppSelector(selectServerUrl);
  return (
    <iframe
      src={serverUrl || ""}
      className="bg-gray-100"
      height={"100%"}
      width={"100%"}
      allowFullScreen
      allow="cross-origin-isolated"
    />
  );
};

export default Iframe;
