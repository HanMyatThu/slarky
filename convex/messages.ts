import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

import { mutation, QueryCtx, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

const populateThread = async (ctx: QueryCtx, messageId: Id<"messages">) => {
  const messages = await ctx.db
    .query("messages")
    .withIndex("by_parent_message_id", (q) =>
      q.eq("parentMessageId", messageId)
    )
    .collect();

  if (!messages.length) {
    return {
      count: 0,
      image: undefined,
      timeStamp: 0,
    };
  }

  const lastMessage = messages[messages.length - 1];
  const lastMessageMember = await popularMember(ctx, lastMessage.memberId);

  if (!lastMessageMember) {
    return {
      count: messages.length,
      image: undefined,
      timeStamp: 0,
    };
  }

  const lastMessageUser = await populateUser(ctx, lastMessageMember.userId);

  return {
    count: messages.length,
    image: lastMessageUser?.image,
    timeStamp: lastMessage._creationTime,
  };
};

const populateReactions = (ctx: QueryCtx, messageId: Id<"messages">) => {
  return ctx.db
    .query("reactions")
    .withIndex("by_message_id", (q) => q.eq("messageId", messageId))
    .collect();
};

const populateUser = (ctx: QueryCtx, userId: Id<"users">) => {
  return ctx.db.get(userId);
};

export const popularMember = (ctx: QueryCtx, memberId: Id<"members">) => {
  return ctx.db.get(memberId);
};

const getMember = async (
  ctx: QueryCtx,
  workspaceId: Id<"workspaces">,
  userId: Id<"users">
) => {
  return ctx.db
    .query("members")
    .withIndex("by_workspace_id_user_id", (q) =>
      q.eq("workspaceId", workspaceId).eq("userId", userId)
    )
    .unique();
};

export const getMessages = query({
  args: {
    channelId: v.optional(v.id("channels")),
    conversationId: v.optional(v.id("conversations")),
    parentMessageId: v.optional(v.id("messages")),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized Access");
    }

    let _conversationId = args.conversationId;

    if (!args.conversationId && !args.channelId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId);

      if (!parentMessage) {
        throw new Error("Parent message not found");
      }

      _conversationId = parentMessage.conversationId;
    }

    const results = await ctx.db
      .query("messages")
      .withIndex("by_channel_id_parent_message_id_conversation_id", (query) =>
        query
          .eq("channelId", args.channelId)
          .eq("parentMessageId", args.parentMessageId)
          .eq("conversationId", _conversationId)
      )
      .order("desc")
      .paginate(args.paginationOpts);

    return {
      ...results,
      page: await Promise.all(
        results.page.map(async (message) => {
          const member = await popularMember(ctx, message.memberId);
          const user = member ? await populateUser(ctx, member.userId) : null;

          if (!member || !user) {
            return null;
          }

          const reactions = await populateReactions(ctx, message._id);

          const thread = await populateThread(ctx, message._id);
          const image = message.image
            ? await ctx.storage.getUrl(message.image)
            : undefined;

          const reactionsWithCount = reactions.map((reaction) => {
            return {
              ...reaction,
              count: reactions.filter((r) => r.value === reaction.value).length,
            };
          });

          const dedupedReactions = reactionsWithCount.reduce(
            (acc, reaction) => {
              const existingReaction = acc.find(
                (r) => r.value === reaction.value
              );

              if (existingReaction) {
                existingReaction.memberIds = Array.from(
                  new Set([...existingReaction.memberIds, reaction.memberId])
                );
              } else {
                acc.push({ ...reaction, memberIds: [reaction.memberId] });
              }

              return acc;
            },
            [] as (Doc<"reactions"> & {
              count: number;
              memberIds: Id<"members">[];
            })[]
          );

          const reactionsWithoutMemberId = dedupedReactions.map(
            ({ memberId, ...rest }) => rest
          );

          return {
            ...message,
            image,
            member,
            user,
            reactions: reactionsWithoutMemberId,
            threadCount: thread.count,
            threadImage: thread.image,
            threadTimestamp: thread.timeStamp,
          };
        })
      ),
    };
  },
});

export const createMessage = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.id("_storage")),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    conversationId: v.optional(v.id("conversations")),
    parentMessageId: v.optional(v.id("messages")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const member = await getMember(ctx, args.workspaceId, userId);

    if (!member) {
      throw new Error("Unauthorized");
    }

    //handle conversationId
    let _conversation_id = args.conversationId;

    //only possible if we are replying in a thread in 1:1 conversation
    if (!args.conversationId && !args.channelId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId);

      if (!parentMessage) {
        throw new Error("Parent message not found");
      }

      _conversation_id = parentMessage.conversationId;
    }

    const messageId = await ctx.db.insert("messages", {
      memberId: member._id,
      body: args.body,
      image: args.image,
      channelId: args.channelId,
      workspaceId: args.workspaceId,
      parentMessageId: args.parentMessageId,
      conversationId: _conversation_id,
    });

    return messageId;
  },
});
