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
        model: openai("gpt-4o"),
        schema: searchResponseSchema,
        messages: [
          {
            role: "system",
            content:
              "You are an expert at extracting search parameters from user queries. Extract only city, country, and effort level (1, 2, or 3) if mentioned. 1 means it's easy and that anyone can do it for low effort, 3 means it's difficult and strong people usually can do it. Return only the fields that are relevant to the search. Multiple fields allowed.",
          },
          {
            role: "user",
            content: query,
          },
        ],
      });

      const searchParams = result.object;
      console.log("Generated search parameters:", searchParams);
      return searchParams;
    } catch (error) {
      console.error("Error in AI search:", error);
      // Return an empty object but ensure we're not silently failing
      throw new Error(
        `AI search failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
);
