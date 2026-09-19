import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser, requireCurrentUser } from "./lib/currentUser";
import {
  buildDirectKey,
  listConversationMembers,
  requireMembership,
} from "./lib/conversationAccess";

const INBOX_LIMIT = 50;
const UNREAD_TOTAL_SCAN_LIMIT = 200;

const inboxEntryValidator = v.object({
  conversationId: v.id("conversations"),
  otherUser: v.object({
    _id: v.id("users"),
    name: v.string(),
    username: v.optional(v.string()),
    avatarUrl: v.string(),
    lastSeenAt: v.optional(v.number()),
  }),
  lastMessagePreview: v.string(),
  lastMessageAt: v.number(),
  lastMessageFromMe: v.boolean(),
  unreadCount: v.number(),
});

export const getOrCreateDirect = mutation({
  args: { otherUserId: v.id("users") },
  returns: v.id("conversations"),
  handler: async (ctx, args) => {
    const me = await requireCurrentUser(ctx);
    if (me._id === args.otherUserId) {
      throw new Error("Cannot message yourself");
    }
    const otherUser = await ctx.db.get("users", args.otherUserId);
    if (!otherUser) throw new Error("User not found");

    const directKey = buildDirectKey(me._id, args.otherUserId);
    const existing = await ctx.db
      .query("conversations")
      .withIndex("by_direct_key", (q) => q.eq("directKey", directKey))
      .unique();
    if (existing) return existing._id;

    const now = Date.now();
    const conversationId = await ctx.db.insert("conversations", {
      kind: "direct",
      directKey,
      lastMessageAt: now,
      lastMessagePreview: "",
      createdAt: now,
    });
    for (const userId of [me._id, args.otherUserId]) {
      await ctx.db.insert("conversationMembers", {
        conversationId,
        userId,
        lastReadAt: now,
        unreadCount: 0,
        lastMessageAt: now,
      });
    }
    return conversationId;
  },
});

export const listMine = query({
  args: {},
  returns: v.array(inboxEntryValidator),
  handler: async (ctx) => {
    const me = await getCurrentUser(ctx);
    if (!me) return [];

    const memberships = await ctx.db
      .query("conversationMembers")
      .withIndex("by_user_and_last_message_at", (q) => q.eq("userId", me._id))
      .order("desc")
      .take(INBOX_LIMIT);

    const entries = [];
    for (const membership of memberships) {
      const conversation = await ctx.db.get("conversations", membership.conversationId);
      if (!conversation) continue;
      const members = await listConversationMembers(ctx, conversation._id);
      const otherMembership = members.find((member) => member.userId !== me._id);
      if (!otherMembership) continue;
      const otherUser = await ctx.db.get("users", otherMembership.userId);
      if (!otherUser) continue;
      const otherUserPresence = await ctx.db
        .query("presence")
        .withIndex("by_user", (q) => q.eq("userId", otherUser._id))
        .unique();
      entries.push({
        conversationId: conversation._id,
        otherUser: {
          _id: otherUser._id,
          name: otherUser.name,
          username: otherUser.username,
          avatarUrl: otherUser.avatarUrl,
          lastSeenAt: otherUserPresence?.lastSeenAt,
        },
        lastMessagePreview: conversation.lastMessagePreview,
        lastMessageAt: conversation.lastMessageAt,
        lastMessageFromMe: conversation.lastMessageSenderId === me._id,
        unreadCount: membership.unreadCount,
      });
    }
    return entries;
  },
});

export const unreadTotal = query({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const me = await getCurrentUser(ctx);
    if (!me) return 0;
    const memberships = await ctx.db
      .query("conversationMembers")
      .withIndex("by_user_and_last_message_at", (q) => q.eq("userId", me._id))
      .order("desc")
      .take(UNREAD_TOTAL_SCAN_LIMIT);
    return memberships.reduce((total, membership) => total + membership.unreadCount, 0);
  },
});

export const markRead = mutation({
  args: { conversationId: v.id("conversations") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const me = await requireCurrentUser(ctx);
    const membership = await requireMembership(ctx, args.conversationId, me._id);
    const conversation = await ctx.db.get("conversations", args.conversationId);
    if (!conversation) return null;
    const alreadyRead =
      membership.unreadCount === 0 &&
      membership.lastReadAt >= conversation.lastMessageAt;
    if (alreadyRead) return null;
    await ctx.db.patch("conversationMembers", membership._id, {
      unreadCount: 0,
      lastReadAt: conversation.lastMessageAt,
    });
    return null;
  },
});

