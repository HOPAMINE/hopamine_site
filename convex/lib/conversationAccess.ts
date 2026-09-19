import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

export async function findMembership(
  ctx: QueryCtx | MutationCtx,
  conversationId: Id<"conversations">,
  userId: Id<"users">,
): Promise<Doc<"conversationMembers"> | null> {
  return ctx.db
    .query("conversationMembers")
    .withIndex("by_conversation_and_user", (q) =>
      q.eq("conversationId", conversationId).eq("userId", userId),
    )
    .unique();
}

export async function requireMembership(
  ctx: QueryCtx | MutationCtx,
  conversationId: Id<"conversations">,
  userId: Id<"users">,
): Promise<Doc<"conversationMembers">> {
  const membership = await findMembership(ctx, conversationId, userId);
  if (!membership) throw new Error("Not a member of this conversation");
  return membership;
}

/** Both member rows of a direct conversation, read by index prefix so the read set stays tiny. */
export async function listConversationMembers(
  ctx: QueryCtx | MutationCtx,
  conversationId: Id<"conversations">,
): Promise<Doc<"conversationMembers">[]> {
  return ctx.db
    .query("conversationMembers")
    .withIndex("by_conversation_and_user", (q) =>
      q.eq("conversationId", conversationId),
    )
    .take(2);
}

export function buildDirectKey(a: Id<"users">, b: Id<"users">): string {
  return [a, b].sort().join(":");
}
