"use client";

import { Toolbar, WorkspaceSidebar } from "@/app/workspace/components";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <Toolbar />

      <div className="flex h-[calc(100vh-40px)]">
        <WorkspaceSidebar />
        {children}
      </div>
    </div>
  );
}
