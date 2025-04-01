import { openai } from "@ai-sdk/openai";
import { generateObject, generateText } from "ai";
import { z } from "zod";
import { webSearchResponseSchema } from "@/models/ai-schemas";
import { GetListingsResult } from "./get-listings";

export async function executeWebSearch(searchQuery?: string): Promise<string> {
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

  return searchResult.text;
}

export async function transformToStructuredData(
  searchResultText: string
): Promise<GetListingsResult> {
  const finalResult = await generateObject({
    model: openai.responses("gpt-4o-mini"),
    prompt: `Convert the following ${searchResultText}`,
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
}

export async function performWebSearch(
  searchQuery?: string
): Promise<GetListingsResult> {
  const searchResultText = await executeWebSearch(searchQuery);
  return transformToStructuredData(searchResultText);
}
