import { getListings, GetListingsResult } from "@/lib/get-listings";
import {
  searchResponseSchema,
  webSearchResponseSchema,
} from "@/models/ai-schemas";
import { openai } from "@ai-sdk/openai";
import { generateObject, generateText, tool } from "ai";
import { z } from "zod";

export function createGetListingsFromDBTool(searchQuery?: string) {
  return tool({
    description:
      "Get the listings from our database. Only use this tool if user asks about listings outside of North America, do not use this tool",
    parameters: searchResponseSchema,
    execute: async (searchParams) => {
      const listings = await getListings(searchParams, searchQuery);
      return listings;
    },
  });
}

export function createWebSearchTool(searchQuery?: string) {
  return tool({
    description:
      "Search the web for information about listings outside of North America. Use this tool when the user is asking about international listings.",
    parameters: z.object({
      query: z
        .string()
        .describe("The search query to look for international listings"),
    }),
    execute: async (params) => {
      const searchResult = await generateText({
        toolChoice: "required",
        model: openai.responses("gpt-4o-mini"),
        prompt: searchQuery,
        tools: {
          web_search_preview: openai.tools.webSearchPreview({
            searchContextSize: "high",
            userLocation: {
              type: "approximate",
            },
          }),
        },
      });

      const finalResult = await generateObject({
        model: openai.responses("gpt-4o-mini"),
        prompt: `Convert the following ${searchResult.text}`,
        schema: z.object({
          listings: z.array(webSearchResponseSchema.omit({ id: true })),
        }),
      });

      const finalListings = {
        regular: finalResult.object.listings.map((listing, index) => ({
          ...listing,
          id: `web-listing-${index}-${Date.now()}`,
        })),
        from_pinecone: [],
      };

      return finalListings;
    },
  });
}
