"use client";

import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
const Layout = ({ children }: Props) => {
  return (
    <div className="flex">
      <div>
        {/* this should contain a list of projects with their files. these should be buttons, that when pressed, redirects to the corresponding page */}
      </div>
      {children}
    </div>
  );
};

export default Layout;
