import { generateText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { getListings, GetListingsResult } from "@/lib/get-listings";
import {
  INITIAL_DEEP_RESEARCH_ROUTER,
  DEEP_RESEARCH_AGENT,
} from "@/prompts/deep-research";
import {
  createGetListingsFromDBTool,
  createWebSearchTool,
} from "@/agent-tools/router";
import { getSourcesOnlineToUnderstandQuestion } from "@/agent-tools/deep-research";
import { NORMAL_SEARCH_ROUTER_PROMPT } from "@/prompts/normal-search";
import { REPORT_FORMAT } from "@/models/report";
import { z } from "zod";
import { executeWebSearch } from "./web-search";
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

export async function getUserQueryUnderstanding(
  searchQuery: string,
  onUnderstandingComplete: (expandedUnderstanding: string | undefined) => void
): Promise<void> {
  await generateText({
    model: openai("gpt-4o"),
    tools: {
      getSourcesOnlineToUnderstandQuestion:
        getSourcesOnlineToUnderstandQuestion(searchQuery),
    },
    onStepFinish({ toolResults }) {
      let expandedUnderstanding;
      for (const toolResult of toolResults) {
        if (toolResult.toolName === "getSourcesOnlineToUnderstandQuestion") {
          expandedUnderstanding = toolResult.result;
        }
      }

      onUnderstandingComplete(expandedUnderstanding);
    },
    system: INITIAL_DEEP_RESEARCH_ROUTER,
    prompt: searchQuery,
    toolChoice: "required",
    maxSteps: 2,
  });
}

export async function getDeepResearch(searchQuery: string) {
  await getUserQueryUnderstanding(searchQuery, (expandedUnderstanding) => {
    getDeepResearchAgentResponse(
      expandedUnderstanding
        ? `${expandedUnderstanding}\n\nUser Query: ${searchQuery}`
        : `User Query: ${searchQuery}`
    );
  });
}

export async function getDeepResearchAgentResponse(inputKnowledge: string) {
  let researchOutline: string | undefined;

  let prompt = `
  This is what the user requires you to research: ${inputKnowledge}
  This is what the format of the final answer would look like: ${REPORT_FORMAT}
  ${researchOutline && `The research outline is ${researchOutline}`}
  `;

  const response = await generateText({
    model: openai("gpt-4o"),
    system: DEEP_RESEARCH_AGENT,
    prompt: prompt,
    tools: {
      webSearch: tool({
        description: "Use this tool to search online for answer",
        parameters: z.object({
          searchQuery: z.string().describe("Search query"),
        }),
        execute: async ({ searchQuery }) => {
          console.log(`The search query: ${searchQuery}`);
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

  return response.text;
}
