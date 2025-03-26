import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { getListings, GetListingsResult } from "@/lib/get-listings";
import ROUTER_PROMPT from "@/prompts/router";
import {
  createGetListingsFromDBTool,
  createWebSearchTool,
} from "@/agent-tools/router";

export async function getAIRouterDecision(
  searchQuery?: string
): Promise<GetListingsResult> {
  const toolCallResult = await generateText({
    model: openai("gpt-4o"),
    tools: {
      getListingsFromDB: createGetListingsFromDBTool(searchQuery),
      getListingsFromWeb: createWebSearchTool(searchQuery),
    },
    system: ROUTER_PROMPT,
    prompt: searchQuery,
    toolChoice: "required",
  });

  for (const toolResult of toolCallResult.toolResults) {
    switch (toolResult.toolName) {
      case "getListingsFromDB":
        return toolResult.result as GetListingsResult;
      case "getListingsFromWeb":
        return toolResult.result as GetListingsResult;
      default:
        return getListings();
    }
  }

  return getListings();
}
