import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { getListings, GetListingsResult } from "@/lib/get-listings";
import { DEEP_RESEARCH_ROUTER_PROMPT } from "@/prompts/deep-research";
import {
  createGetListingsFromDBTool,
  createWebSearchTool,
} from "@/agent-tools/router";
import { getSourcesOnlineToUnderstandQuestion } from "@/agent-tools/deep-research";
import { NORMAL_SEARCH_ROUTER_PROMPT } from "@/prompts/normal-search";
export async function getNormalSearchRouterDecision(
  searchQuery?: string
): Promise<GetListingsResult> {
  const toolCallResult = await generateText({
    model: openai("gpt-4o"),
    tools: {
      getListingsFromDB: createGetListingsFromDBTool(searchQuery),
      getListingsFromWeb: createWebSearchTool(searchQuery),
    },
    system: NORMAL_SEARCH_ROUTER_PROMPT,
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

export async function getDeepResearchRouterDecision(
  searchQuery: string
): Promise<GetListingsResult> {
  const userQueryUnderstandingRouter = await generateText({
    model: openai("gpt-4o"),
    tools: {
      getSourcesOnlineToUnderstandQuestion:
        getSourcesOnlineToUnderstandQuestion(searchQuery),
    },
    onStepFinish({ text, toolCalls, toolResults, finishReason, usage }) {
      let expandedUnderstanding;
      for (const toolResult of toolResults) {
        if (toolResult.toolName === "getSourcesOnlineToUnderstandQuestion") {
          expandedUnderstanding = toolResult.result;
        }
      }

      runResearchAgent(
        expandedUnderstanding
          ? `${expandedUnderstanding}\n\nUser Query: ${searchQuery}`
          : `User Query: ${searchQuery}`
      );
    },
    system: DEEP_RESEARCH_ROUTER_PROMPT,
    prompt: searchQuery,
    toolChoice: "required",
    maxSteps: 2,
  });

  return getListings();
}

export async function runResearchAgent(inputKnowledge: string) {
  console.log("RESEARCH AGENT HAD STARTED!");
  console.log(inputKnowledge);

  return;

  const researchAgent = await generateText({
    model: openai("gpt-4o"),
    system: DEEP_RESEARCH_ROUTER_PROMPT,
    prompt: "ADD THE RESEARCH AGENT PROMPT HERE",
    toolChoice: "required",
    maxSteps: 2,
  });
}
