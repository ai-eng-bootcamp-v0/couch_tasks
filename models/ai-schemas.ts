import { z } from "zod";

export const searchResponseSchema = z.object({
  city: z.string().optional().describe("City name to search for"),
  country: z.string().optional().describe("Country name to search for"),
  effort_level: z
    .enum(["1", "2", "3"])
    .optional()
    .describe("Effort level (1: easy, 2: medium, 3: hard)"),
});

export type SearchResponse = z.infer<typeof searchResponseSchema>;
