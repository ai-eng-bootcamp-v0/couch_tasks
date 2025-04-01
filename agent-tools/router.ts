import { getListings } from "@/lib/get-listings";
import { performWebSearch } from "@/lib/web-search";
import { searchResponseSchema } from "@/models/ai-schemas";
import { tool } from "ai";
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
      "Search the web for information about listings outside of Canada. Use this tool when the user is asking about international listings.",
    parameters: z.object({
      query: z
        .string()
        .describe("The search query to look for international listings"),
    }),
    execute: async () => {
      return performWebSearch(searchQuery);
    },
  });
}
