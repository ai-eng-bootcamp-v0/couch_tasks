import { openai } from "@ai-sdk/openai";
import { Message, streamText, tool } from "ai";
import { executeWebSearch } from "@/lib/web-search";
import { DEEP_RESEARCH_AGENT } from "@/prompts/deep-research";
import { REPORT_FORMAT } from "@/models/report";
import { z } from "zod";

export const maxDuration = 120; // Setting max duration to 2 minutes

export async function POST(request: Request) {
  const { searchQuery, messages } = await request.json();

  // Extract the last user message if we have messages
  const lastUserMessage =
    messages && messages.length > 0
      ? messages.findLast((m: Message) => m.role === "user")?.content
      : searchQuery;

  if (!lastUserMessage) {
    return new Response(JSON.stringify({ error: "No query provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let researchOutline: string | undefined;

  const prompt = `
  This is what the user requires you to research: ${lastUserMessage}
  This is what the format of the final answer would look like: ${REPORT_FORMAT}
  ${researchOutline ? `The research outline is ${researchOutline}` : ""}
  `;

  const result = streamText({
    model: openai("gpt-4o"),
    system: DEEP_RESEARCH_AGENT,
    prompt,
    tools: {
      webSearch: tool({
        description: "Use this tool to search online for answer",
        parameters: z.object({
          searchQuery: z.string().describe("Search query"),
        }),
        execute: async ({ searchQuery }) => {
          console.log(`Searching for: ${searchQuery}`);
          return await executeWebSearch(searchQuery);
        },
      }),
      writeToResearchPlan: tool({
        description: "Use this tool to write or update the research plan",
        parameters: z.object({
          newVersion: z
            .string()
            .describe("The new version of the research plan"),
        }),
        execute: async ({ newVersion }) => {
          console.log(`
            ### Old version:
            ${researchOutline}
            `);
          researchOutline = newVersion;
          return newVersion;
        },
      }),
    },
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}
