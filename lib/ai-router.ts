import { generateText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { getListings, GetListingsResult } from "@/lib/get-listings";
import {
  DEEP_RESEARCH_ROUTER_PROMPT,
  REPORT_WRITER_PROMPT,
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
  console.log("Running research agent");

  let researchOutline: string | undefined;

  let prompt = `
  This is what the user requires you to research: ${inputKnowledge}
  This is what the format of the final answer would look like: ${REPORT_FORMAT}
  ${researchOutline && `The research outline is ${researchOutline}`}
  `;

  const researchAgent = await generateText({
    model: openai("gpt-4o"),
    system: REPORT_WRITER_PROMPT,
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
  console.log(researchOutline);
  console.log(researchAgent.text);
}
