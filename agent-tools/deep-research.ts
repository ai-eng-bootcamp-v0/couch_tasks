import { executeWebSearch } from "@/lib/web-search";
import { openai } from "@ai-sdk/openai";
import { generateText, tool } from "ai";
import { z } from "zod";

export function getSourcesOnlineToUnderstandQuestion(searchQuery: string) {
  return tool({
    description:
      "Take the user's question and break it into 3 sub questions to then search the web to understand what they mean.",
    parameters: z.object({
      subQueries: z.array(z.string()).refine((arr) => arr.length <= 3, {
        message: "Array must contain at most 3 strings",
      }),
    }),
    execute: async (params) => {
      console.log(params);
      const searchResults = await Promise.all(
        params.subQueries.map((query) => executeWebSearch(query))
      );

      // Generate a paragraph of understanding:
      const understandingParagraph = await generateText({
        model: openai.responses("gpt-4o-mini"),
        system: `You are an expert at synthesizing the user's question
        with newly given web results for sub questions around that original question.
        You must write a very short paragraph of your overall understanding of what the user is]
        asking for so that this text can later be given to another researcher to do the next step.`,
        prompt: `
        Here's the user's original question: ${searchQuery}
        Here are the web search results:
        ${searchResults.map((result) => result)}
        `,
      });

      console.log(understandingParagraph.text);

      // return understandingParagraph;
    },
  });
}
