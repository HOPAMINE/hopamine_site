import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireCurrentUser } from "./lib/currentUser";
import {
  listConversationMembers,
  requireMembership,
} from "./lib/conversationAccess";

export const MESSAGE_BODY_MAX_LENGTH = 2000;
const PREVIEW_MAX_LENGTH = 120;

/** Newest first; the client reverses each page for display. */
export const list = query({
  args: {
    conversationId: v.id("conversations"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const me = await requireCurrentUser(ctx);
    await requireMembership(ctx, args.conversationId, me._id);
    return ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId),
      )
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

/** Inserts the message and updates the conversation and both member rows in one transaction. */
export const send = mutation({
  args: {
    conversationId: v.id("conversations"),
    body: v.string(),
  },
  returns: v.id("messages"),
  handler: async (ctx, args) => {
    const me = await requireCurrentUser(ctx);
    await requireMembership(ctx, args.conversationId, me._id);

    const body = args.body.trim();
    if (!body) throw new ConvexError("Message is empty.");
    if (body.length > MESSAGE_BODY_MAX_LENGTH) {
      throw new ConvexError(
        `Message is too long. Keep it under ${MESSAGE_BODY_MAX_LENGTH.toLocaleString()} characters.`,
      );
    }

    const now = Date.now();
    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: me._id,
      body,
      createdAt: now,
    });

    await ctx.db.patch("conversations", args.conversationId, {
      lastMessageAt: now,
      lastMessagePreview: body.slice(0, PREVIEW_MAX_LENGTH),
      lastMessageSenderId: me._id,
    });

    const members = await listConversationMembers(ctx, args.conversationId);
    for (const member of members) {
      const isSender = member.userId === me._id;
      await ctx.db.patch("conversationMembers", member._id, {
        lastMessageAt: now,
        unreadCount: isSender ? 0 : member.unreadCount + 1,
        lastReadAt: isSender ? now : member.lastReadAt,
      });
    }

    return messageId;
  },
});
