# Human review: Zima direct messages

Branch `zima_chat_dock`, uncommitted. Full change set: `git status --short` (markers removed after review of steps 1-7).

- [x] Step 1. One helper instead of 25 copies — `convex/lib/currentUser.ts:5-23`, `convex/context.md`
- [x] Step 2. The shape of a conversation — `convex/schema.ts:152-181`
- [x] Step 3. The membership guard — `convex/lib/conversationAccess.ts:5-43`
- [x] Step 4. Starting, listing, reading conversations — `convex/conversations.ts:28-143`
- [x] Step 5. Sending a message — `convex/messages.ts:15-76`
- [x] Step 6. Time labels — `src/lib/zima/chatTime.ts:28-49`
- [ ] Step 7. The view models — `src/lib/zima/zimaChats.ts:2-13, 67-74`
- [ ] Step 8. Dock state in one place — `src/components/zima/chat/ZimaChatDockProvider.tsx:18-118`
- [ ] Step 9. The inbox hook and the badge — `src/components/zima/chat/useZimaConversations.ts:11-56`
- [ ] Step 10. Thread hook: optimistic send, guarded mark-read — `src/components/zima/chat/useZimaThread.ts:19-113`
- [ ] Step 11. Starting a new conversation — `src/components/zima/chat/ZimaChatDockNewMessage.tsx:18-80`
- [ ] Step 12. The container — `src/components/zima/chat/ZimaChatDock.tsx:50-306`
- [ ] Step 13. The panes — `ZimaChatDockInbox.tsx:9-66`, `ZimaChatDockThread.tsx:15-117`
- [ ] Step 14. Wiring into the site — `src/app/zima/layout.tsx:35-40`, `src/app/zima/ZimaAuthButtons.tsx:53-75`
- [ ] Step 15. Load guards mapped to the verifier's findings
- [ ] Step 16. Known loose ends
- [ ] Step 17. Cleanup — `rm HUMAN_REVIEW.md`
