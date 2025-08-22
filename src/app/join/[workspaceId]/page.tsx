"use client";

import { Button } from "@/components/ui/button";
import {
  useGetWorkspaceInfo,
  useJoinWorkspace,
} from "@/features/workspaces/api";
import { useWorkspaceId } from "@/hooks";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import VerificationInput from "react-verification-input";
import { toast } from "sonner";

export default function JoinWorkspacePage() {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const { data, isLoading } = useGetWorkspaceInfo(workspaceId);
  const { mutate, isPending } = useJoinWorkspace();

  const isMember = useMemo(() => data?.isMember, [data?.isMember]);

  useEffect(() => {
    if (isMember) router.push(`/workspace/${workspaceId}`);
  }, [isMember, router, workspaceId]);

  const handleComplete = (value: string) => {
    mutate(
      { workspaceId, joinCode: value },
      {
        onSuccess: (id) => {
          router.replace(`/workspace/${id}`);
          toast.success("Joined workspace");
        },
        onError: () => toast.error("Failed to join workspace"),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-8 text-muted-foreground animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md">
      <Image src="/slack-logo.svg" alt="LinkUp Logo" width={60} height={60} />

      <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-2xl font-bold">Join {data?.name} workspace</h1>
          <p className="text-base text-muted-foreground">
            Enter the workspace code to join
          </p>
        </div>

        <VerificationInput
          autoFocus
          length={6}
          onComplete={handleComplete}
          classNames={{
            container: cn(
              "flex gap-x-2",
              isPending && "opacity-50 cursor-not-allowed"
            ),
            character:
              "uppercase h-auto rounded-md border border-gary-300 flex items-center justify-center text-lg font-medium text-gray-500",
            characterInactive: "bg-muted",
            characterSelected: "bg-white text-black",
            characterFilled: "bg-white text-black",
          }}
        />
      </div>

      <div className="flex gap-x-4">
        <Button size="lg" variant="outline" asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
