"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCreateChannel } from "@/features/channels/api";
import { useCreateChannelModal } from "@/features/channels/store";
import { useWorkspaceId } from "@/hooks";
import { useState } from "react";
import { toast } from "sonner";

export function CreateChannelModal() {
  const workspaceId = useWorkspaceId();
  const [name, setName] = useState("");
  const [open, setOpen] = useCreateChannelModal();
  const { mutate, isPending } = useCreateChannel();

  const handleClose = () => {
    setName("");
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();

    setName(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(
      {
        name,
        workspaceId,
      },
      {
        onSuccess: () => {
          toast.success("Channel created successfully.");
          handleClose();
        },
        onError: () => {
          toast.error("Failed to create channel!");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a channel</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            value={name}
            onChange={handleChange}
            disabled={isPending}
            required
            autoFocus
            minLength={3}
            maxLength={50}
            placeholder="e.g. web-team"
          />

          <div className="flex justify-end">
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
