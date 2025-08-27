import { useQueryState } from "nuqs";

export function useMemberProfileId() {
  return useQueryState("memberProfileId");
}
