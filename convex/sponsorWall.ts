import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const ROLLING_WINDOW_DAYS = 30;

function utcDateKey(date: Date): string {
  return date.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function dateKeyDaysAgo(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return utcDateKey(d);
}

/** Anonymous, unauthenticated: fires once per page load from the sponsor wall. */
export const recordView = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const today = utcDateKey(new Date());
    const existing = await ctx.db
      .query("sponsorWallViewDailyCounts")
      .withIndex("by_date_key", (q) => q.eq("dateKey", today))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { count: existing.count + 1 });
    } else {
      await ctx.db.insert("sponsorWallViewDailyCounts", { dateKey: today, count: 1 });
    }

    return null;
  },
});

/** Sum of daily counts over the trailing 30 days — a live "views per month" figure. */
export const getRollingViewCount = query({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const cutoff = dateKeyDaysAgo(ROLLING_WINDOW_DAYS - 1);
    const days = await ctx.db
      .query("sponsorWallViewDailyCounts")
      .withIndex("by_date_key", (q) => q.gte("dateKey", cutoff))
      .take(ROLLING_WINDOW_DAYS + 1); // +1 guards a same-day boundary read, not a real growth risk

    return days.reduce((sum, day) => sum + day.count, 0);
  },
});
