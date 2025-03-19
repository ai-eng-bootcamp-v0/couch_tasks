import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await generateText({
    model: openai("gpt-4o-mini"),
    messages,
  });

  return result.text;
}
