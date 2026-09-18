/** Placeholder inbox until Zima DMs are backed by Convex. */
export type ZimaConversation = {
  id: string;
  participantName: string;
  participantTagline: string;
  avatarUrl: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount?: number;
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
