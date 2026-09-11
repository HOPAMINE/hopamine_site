import { NextResponse } from "next/server";
import { generateZimaReply } from "@/lib/zima/chat";
import { ZIMA_SYSTEM_PROMPT } from "@/lib/zima/constants";
import type { ZimaChatMessage } from "@/lib/zima/types";

type ChatRequestBody = {
  messages: ZimaChatMessage[];
  location?: string;
};

export async function POST(request: Request) {
  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json({ error: "Messages are required" }, { status: 400 });
  }

  const location = body.location?.trim();
  const systemPrompt = location
    ? `${ZIMA_SYSTEM_PROMPT}\n\nThe user's location is: ${location}.`
    : ZIMA_SYSTEM_PROMPT;

  try {
    const message = await generateZimaReply(systemPrompt, body.messages);
    return NextResponse.json({ message });
  } catch (error) {
    console.error("Zima chat error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to get a response from zima",
      },
      { status: 502 },
    );
  }
}
