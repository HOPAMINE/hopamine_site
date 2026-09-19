/** Placeholder inbox, still rendered by the mobile /chats page. The desktop dock reads Convex. */
export type ZimaConversation = {
  id: string;
  participantName: string;
  participantTagline: string;
  avatarUrl: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount?: number;
  otherUserId?: string;
  isOnline?: boolean;
};

export const ZIMA_CONVERSATIONS: ZimaConversation[] = [
  {
    id: "marco-reyes",
    participantName: "Marco Reyes",
    participantTagline: "Coach · Williamsburg",
    avatarUrl:
      "https://i.pinimg.com/736x/28/65/b4/2865b4335e5979486a14eba32a965cb5.jpg",
    lastMessage: "Sunrise stairs at the bridge tomorrow — you in?",
    lastMessageAt: "2h ago",
    unreadCount: 2,
  },
  {
    id: "zee-kwon",
    participantName: "Zee Kwon",
    participantTagline: "DJ · Bushwick",
    avatarUrl:
      "https://i.pinimg.com/736x/68/91/00/6891003ba076fcca339c2c2ae7f48d2c.jpg",
    lastMessage: "Sent you the warehouse lineup draft.",
    lastMessageAt: "Yesterday",
  },
  {
    id: "sasha-morrow",
    participantName: "Sasha Morrow",
    participantTagline: "Reporter · East Village",
    avatarUrl:
      "https://i.pinimg.com/736x/34/19/57/341957596ea77ed7d003f7f31cb6a7bf.jpg",
    lastMessage: "Tenant meeting notes are in the shared doc.",
    lastMessageAt: "Mon",
  },
  {
    id: "kenji-sato",
    participantName: "Kenji Sato",
    participantTagline: "Illustrator · DUMBO",
    avatarUrl:
      "https://i.pinimg.com/736x/1c/ec/ee/1ceceef715316987eddb6c99d21ffe8f.jpg",
    lastMessage: "Love the rooftop garden idea for the zine.",
    lastMessageAt: "Sun",
    unreadCount: 1,
  },
  {
    id: "riley-chen",
    participantName: "Riley Chen",
    participantTagline: "Archivist · Astoria",
    avatarUrl:
      "https://i.pinimg.com/736x/02/92/89/0292891e92ac172d952e82e78cf09d7e.jpg",
    lastMessage: "Can you intro me to the community board lead?",
    lastMessageAt: "Last week",
  },
];

export type ZimaThreadMessageSender = "me" | "them";

export type ZimaThreadMessage = {
  id: string;
  sender: ZimaThreadMessageSender;
  body: string;
  sentAtLabel: string;
  isPending?: boolean;
};

/** Placeholder threads for the placeholder inbox above. Nothing live reads these. */
export const ZIMA_THREAD_MESSAGES: Record<string, ZimaThreadMessage[]> = {
  "marco-reyes": [
    { id: "marco-1", sender: "them", body: "Yo, you still doing the bridge stairs this week?", sentAtLabel: "Today 8:40 AM" },
    { id: "marco-2", sender: "me", body: "Thinking about it. What time?", sentAtLabel: "Today 8:52 AM" },
    { id: "marco-3", sender: "them", body: "Sunrise stairs at the bridge tomorrow — you in?", sentAtLabel: "Today 9:12 AM" },
    { id: "marco-4", sender: "them", body: "Bring the nurses from the night shift if they're up for it.", sentAtLabel: "Today 9:13 AM" },
  ],
  "zee-kwon": [
    { id: "zee-1", sender: "me", body: "Did the warehouse confirm the date?", sentAtLabel: "Yesterday 6:10 PM" },
    { id: "zee-2", sender: "them", body: "Sent you the warehouse lineup draft.", sentAtLabel: "Yesterday 7:02 PM" },
  ],
  "sasha-morrow": [
    { id: "sasha-1", sender: "them", body: "Tenant meeting notes are in the shared doc.", sentAtLabel: "Mon 4:30 PM" },
    { id: "sasha-2", sender: "me", body: "Perfect, reading now.", sentAtLabel: "Mon 4:41 PM" },
  ],
  "kenji-sato": [
    { id: "kenji-1", sender: "me", body: "What if the zine cover is the rooftop garden?", sentAtLabel: "Sun 1:15 PM" },
    { id: "kenji-2", sender: "them", body: "Love the rooftop garden idea for the zine.", sentAtLabel: "Sun 2:03 PM" },
  ],
  "riley-chen": [
    { id: "riley-1", sender: "them", body: "Can you intro me to the community board lead?", sentAtLabel: "Last week" },
  ],
};
