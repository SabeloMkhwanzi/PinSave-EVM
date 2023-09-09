import { HeaderNav } from "./HeaderNav";
import { AppShell } from "@mantine/core";
import React from "react";

interface LayoutProps {
  children: JSX.Element;
}
const LayoutApp = ({ children }: LayoutProps) => {
  return (
    <AppShell
      header={
        <HeaderNav
          links={[
            { label: "Home", link: "/" },
            { label: "Create", link: "/upload" },
          ]}
        />
      }
    >
      {children}
    </AppShell>
  );
};

export default LayoutApp;
