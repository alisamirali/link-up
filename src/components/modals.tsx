"use client";

import { CreateChannelModal } from "@/features/channels/components";
import { CreateWorkspaceModal } from "@/features/workspaces/components";
import { useEffect, useState } from "react";

export function Modals() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <CreateWorkspaceModal />
      <CreateChannelModal />
    </>
  );
}
