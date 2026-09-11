export type ZimaChatRole = "user" | "assistant";

export type ZimaChatMessage = {
  role: ZimaChatRole;
  content: string;
};
