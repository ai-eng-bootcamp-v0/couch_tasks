import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { searchResponseSchema, type SearchResponse } from "@/models/ai-schemas";
import { cache } from "react";

// We use cache here so when user searches for the exact same thing again, we don't process with AI
export const aiSearch = cache(
  async (query: string): Promise<SearchResponse> => {
    try {
      if (!query || query.trim() === "") {
        return {};
      }

      const result = await generateObject({
        model: openai("gpt-4o-mini"),
        schema: searchResponseSchema,
        messages: [
          {
            role: "system",
            content:
              "You are an expert at extracting search parameters from user queries. Extract only city, country, and effort level (1, 2, or 3) if mentioned. Return only the fields that are relevant to the search.",
          },
          {
            role: "user",
            content: query,
          },
        ],
      });

      const searchParams = result.object;
      return searchParams;
    } catch (error) {
      console.error("Error in AI search:", error);
      return {};
    }
  }
);
