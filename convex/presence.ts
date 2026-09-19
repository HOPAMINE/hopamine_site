import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getCurrentUser } from "./lib/currentUser";

/**
 * The only presence write. Online is never stored; readers derive it from how
 * recently this ran, so there is no offline write and no cleanup job.
 */
export const touchPresence = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;
    const lastSeenAt = Date.now();
    const existing = await ctx.db
      .query("presence")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    if (existing) {
      await ctx.db.patch("presence", existing._id, { lastSeenAt });
    } else {
      await ctx.db.insert("presence", { userId: user._id, lastSeenAt });
    }
    return null;
  },
});

