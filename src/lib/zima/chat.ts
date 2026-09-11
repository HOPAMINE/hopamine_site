import type { ZimaChatMessage } from "@/lib/zima/types";

async function callGemini(
  apiKey: string,
  systemPrompt: string,
  messages: ZimaChatMessage[],
): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: messages.map((message) => ({
          role: message.role === "assistant" ? "model" : "user",
          parts: [{ text: message.content }],
        })),
      }),
    },
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Gemini request failed (${response.status}): ${details}`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };

  const content = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!content) {
    throw new Error("Gemini returned an empty response");
  }

  return content;
}

export async function generateZimaReply(
  systemPrompt: string,
  messages: ZimaChatMessage[],
): Promise<string> {
  const apiKey = process.env.GEMINI_API?.trim();
  if (!apiKey) {
    throw new Error(
      "GEMINI_API is not configured. Add it to .env.local from aistudio.google.com/apikey.",
    );
  }

  return callGemini(apiKey, systemPrompt, messages);
}
