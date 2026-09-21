import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { internalMutation, type MutationCtx } from "./_generated/server";

/**
 * Throwaway NYC builders for exercising Zima search past the six-candidate
 * threshold where the model gets called. Run with
 *   npx convex run seedZimaTestUsers:seed
 * and clean up with
 *   npx convex run seedZimaTestUsers:remove
 * Every row is tagged by email domain so removal never touches real accounts.
 */
const TEST_EMAIL_DOMAIN = "zima-test.invalid";

type TestUser = {
  slug: string;
  name: string;
  neighborhood: string;
  bio: string;
  archetypes: string[];
  interests: string[];
  avatarUrl: string;
};

const AVATARS = [
  "https://i.pinimg.com/736x/1c/ec/ee/1ceceef715316987eddb6c99d21ffe8f.jpg",
  "https://i.pinimg.com/736x/28/65/b4/2865b4335e5979486a14eba32a965cb5.jpg",
  "https://i.pinimg.com/736x/68/91/00/6891003ba076fcca339c2c2ae7f48d2c.jpg",
  "https://i.pinimg.com/736x/34/19/57/341957596ea77ed7d003f7f31cb6a7bf.jpg",
  "https://i.pinimg.com/736x/02/92/89/0292891e92ac172d952e82e78cf09d7e.jpg",
  "https://i.pinimg.com/736x/a6/87/db/a687db6845aa0fb57a498019ab557706.jpg",
  "https://i.pinimg.com/736x/0d/5e/41/0d5e41cce67d216f0f6c779988ceed66.jpg",
];

const TEST_USERS: TestUser[] = [
  {
    slug: "mawuli-test",
    name: "Mawuli Test",
    neighborhood: "Hell's Kitchen",
    bio: "Runs a rooftop vegetable plot and teaches weekend compost workshops. Shares harvests with nearby shelters.",
    archetypes: ["Farmer", "Community builder"],
    interests: ["Urban farming", "Compost", "Food systems"],
    avatarUrl: AVATARS[0]!,
  },
  {
    slug: "bella-test",
    name: "Bella Test",
    neighborhood: "Ridgewood",
    bio: "Repair café volunteer who keeps old laptops and radios out of the trash and teaches newcomers to solder.",
    archetypes: ["Builder"],
    interests: ["Repair", "Zero waste", "Education"],
    avatarUrl: AVATARS[1]!,
  },
  {
    slug: "theo-test",
    name: "Theo Test",
    neighborhood: "Bushwick",
    bio: "Documentary filmmaker shooting a series on community solar co-ops across Brooklyn rooftops.",
    archetypes: ["Filmmaker", "Creator"],
    interests: ["Energy", "Climate", "Community"],
    avatarUrl: AVATARS[2]!,
  },
  {
    slug: "amara-test",
    name: "Amara Test",
    neighborhood: "Harlem",
    bio: "Works on housing policy at a tenant advocacy group. Organizing a block-level heat pump pilot.",
    archetypes: ["Policy maker", "Community builder"],
    interests: ["Housing", "Civic", "Energy"],
    avatarUrl: AVATARS[3]!,
  },
  {
    slug: "kenji-test",
    name: "Kenji Test",
    neighborhood: "Long Island City",
    bio: "Backend developer building open data tools for tracking neighborhood air quality sensors.",
    archetypes: ["Developer", "Builder"],
    interests: ["Technology", "Climate", "Civic"],
    avatarUrl: AVATARS[4]!,
  },
  {
    slug: "rosa-test",
    name: "Rosa Test",
    neighborhood: "Sunset Park",
    bio: "Runs a mutual aid pantry and a monthly seed swap. Wants to connect gardens along 4th Avenue.",
    archetypes: ["Community builder"],
    interests: ["Mutual aid", "Urban farming", "Community"],
    avatarUrl: AVATARS[5]!,
  },
  {
    slug: "sam-test",
    name: "Sam Test",
    neighborhood: "Williamsburg",
    bio: "Product designer prototyping a tool library app so nobody on the block buys a drill they use twice.",
    archetypes: ["Designer"],
    interests: ["Repair", "Technology", "Zero waste"],
    avatarUrl: AVATARS[6]!,
  },
  {
    slug: "nia-test",
    name: "Nia Test",
    neighborhood: "Astoria",
    bio: "Writer covering parks, waterfront access and the fight for shade in Queens.",
    archetypes: ["Writer"],
    interests: ["Parks", "Nature", "Civic"],
    avatarUrl: AVATARS[0]!,
  },
  {
    slug: "leo-test",
    name: "Leo Test",
    neighborhood: "Red Hook",
    bio: "Sculptor working with reclaimed dock timber. Hosts open studio nights for the neighborhood.",
    archetypes: ["Artist", "Creator"],
    interests: ["Nature", "Community", "Zero waste"],
    avatarUrl: AVATARS[1]!,
  },
  {
    slug: "priya-test",
    name: "Priya Test",
    neighborhood: "Crown Heights",
    bio: "Beekeeper and native plant grower restoring tree pits and a vacant lot into a pollinator garden.",
    archetypes: ["Farmer"],
    interests: ["Biodiversity", "Nature", "Urban farming"],
    avatarUrl: AVATARS[2]!,
  },
];

function testEmail(user: TestUser): string {
  return `${user.slug}@${TEST_EMAIL_DOMAIN}`;
}

async function findTestUserId(
  ctx: MutationCtx,
  user: TestUser,
): Promise<Id<"users"> | null> {
  const existing = await ctx.db
    .query("users")
    .withIndex("by_email", (q) => q.eq("email", testEmail(user)))
    .unique();
  return existing?._id ?? null;
}

/** Inserts the test users, skipping any already present. */
export const seed = internalMutation({
  args: {},
  returns: v.object({ inserted: v.number(), skipped: v.number() }),
  handler: async (ctx) => {
    let inserted = 0;
    let skipped = 0;
    const now = Date.now();
    for (const [index, user] of TEST_USERS.entries()) {
      if (await findTestUserId(ctx, user)) {
        skipped += 1;
        continue;
      }
      // Spread creation times so "newest first" ordering is stable and readable.
      const createdAt = now - index * 60_000;
      await ctx.db.insert("users", {
        clerkId: `zima-test:${user.slug}`,
        email: testEmail(user),
        name: user.name,
        username: user.slug,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        location: `${user.neighborhood}, New York City`,
        skills: user.archetypes,
        interests: user.interests,
        contactEmail: testEmail(user),
        onboardingCompletedAt: createdAt,
        zimaOnboardingCompletedAt: createdAt,
        createdAt,
        updatedAt: createdAt,
      });
      inserted += 1;
    }
    return { inserted, skipped };
  },
});

/** Deletes the test users plus any presence rows and conversations created while testing. */
export const remove = internalMutation({
  args: {},
  returns: v.object({ removedUsers: v.number(), removedConversations: v.number() }),
  handler: async (ctx) => {
    let removedUsers = 0;
    let removedConversations = 0;
    for (const user of TEST_USERS) {
      const userId = await findTestUserId(ctx, user);
      if (!userId) continue;

      const presenceRows = await ctx.db
        .query("presence")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();
      for (const row of presenceRows) await ctx.db.delete(row._id);

      const memberships = await ctx.db
        .query("conversationMembers")
        .withIndex("by_user_and_last_message_at", (q) => q.eq("userId", userId))
        .collect();
      for (const membership of memberships) {
        const conversationId = membership.conversationId;
        const messages = await ctx.db
          .query("messages")
          .withIndex("by_conversation", (q) => q.eq("conversationId", conversationId))
          .collect();
        for (const message of messages) await ctx.db.delete(message._id);
        const allMembers = await ctx.db
          .query("conversationMembers")
          .withIndex("by_conversation_and_user", (q) => q.eq("conversationId", conversationId))
          .collect();
        for (const member of allMembers) await ctx.db.delete(member._id);
        await ctx.db.delete(conversationId);
        removedConversations += 1;
      }

      await ctx.db.delete(userId);
      removedUsers += 1;
    }
    return { removedUsers, removedConversations };
  },
});
