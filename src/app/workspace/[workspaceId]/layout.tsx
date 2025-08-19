"use client";

import { Toolbar } from "@/features/workspaces/components";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <Toolbar />
      {children}
    </div>
  );
}
