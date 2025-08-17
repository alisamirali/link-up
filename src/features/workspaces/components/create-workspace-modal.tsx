import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCreateWorkspace } from "@/features/workspaces/api";
import { useCreateWorkspaceModal } from "@/features/workspaces/store";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export function CreateWorkspaceModal() {
  const [name, setName] = useState("");
  const [open, setOpen] = useCreateWorkspaceModal();
  const { mutate, isPending, isError, isSuccess, data, error } =
    useCreateWorkspace();
  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
    setName("");
  };

  const handleCreateWorkspace = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(
      { name },
      {
        onSuccess: (workspaceId) => {
          toast.success("Workspace created successfully");
          router.push(`/workspace/${workspaceId}`);
          handleClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create workspace</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleCreateWorkspace}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isPending}
            autoFocus
            minLength={3}
            placeholder="Workspace name e.g. 'Work', 'Personal'"
          />

          <div className="flex justify-end">
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
