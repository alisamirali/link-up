import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

export const createOrGet = mutation({
  args: {
    memberId: v.id("members"),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    const otherMember = await ctx.db.get(args.memberId);
    if (!currentMember || !otherMember) throw new Error("Member not found");

    const existingConversation = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("workspaceId"), args.workspaceId))
      .filter((q) =>
        q.or(
          q.and(
            q.eq(q.field("memberOneId"), currentMember._id),
            q.eq(q.field("memberTwoId"), otherMember._id)
          ),
          q.and(
            q.eq(q.field("memberOneId"), otherMember._id),
            q.eq(q.field("memberTwoId"), currentMember._id)
          )
        )
      )
      .unique();

    if (existingConversation) return existingConversation._id;

    const conversationId = await ctx.db.insert("conversations", {
      workspaceId: args.workspaceId,
      memberOneId: currentMember._id,
      memberTwoId: otherMember._id,
    });

    return conversationId;
  },
});

export const getAll = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!currentMember) return [];

    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .filter((q) =>
        q.or(
          q.eq(q.field("memberOneId"), currentMember._id),
          q.eq(q.field("memberTwoId"), currentMember._id)
        )
      )
      .collect();

    const conversationsWithMembers = await Promise.all(
      conversations.map(async (conversation) => {
        const memberOne = await ctx.db.get(conversation.memberOneId);
        const memberTwo = await ctx.db.get(conversation.memberTwoId);

        const otherMember =
          memberOne?._id === currentMember._id ? memberTwo : memberOne;

        const otherMemberUser = otherMember
          ? await ctx.db.get(otherMember.userId)
          : null;

        // Get the last message in the conversation (not a thread reply)
        const allMessages = await ctx.db
          .query("messages")
          .withIndex("by_conversation_id", (q) =>
            q.eq("conversationId", conversation._id)
          )
          .order("desc")
          .collect();

        // Filter out thread replies (messages with parentMessageId)
        const lastMessage = allMessages.find(
          (msg) => msg.parentMessageId === undefined
        );

        return {
          ...conversation,
          otherMember: otherMember
            ? {
                ...otherMember,
                user: otherMemberUser,
              }
            : null,
          lastMessage,
        };
      })
    );

    // Sort by last message time (most recent first)
    conversationsWithMembers.sort((a, b) => {
      const aTime = a.lastMessage?._creationTime ?? 0;
      const bTime = b.lastMessage?._creationTime ?? 0;
      return bTime - aTime;
    });

    return conversationsWithMembers;
  },
});
