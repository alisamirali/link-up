"use client";

import {
  Toolbar,
  WorkspaceChannelsSidebar,
  WorkspaceSidebar,
} from "@/app/workspace/components";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

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

        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="workspace-layout"
        >
          <ResizablePanel
            defaultSize={20}
            minSize={11}
            className="bg-[#5E2C5F]"
          >
            <WorkspaceChannelsSidebar />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel minSize={20}>{children}</ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
