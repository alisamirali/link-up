import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type Props = {
  workspaceId: Id<"workspaces">;
};

export function useGetConversations({ workspaceId }: Props) {
  const data = useQuery(api.conversations.getAll, { workspaceId });
  const isLoading = data === undefined;

  return {
    data,
    isLoading,
  };
}
