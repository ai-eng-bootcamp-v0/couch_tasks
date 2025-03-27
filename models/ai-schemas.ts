import { z } from "zod";

export const searchResponseSchema = z.object({
  id: z.string().optional(),
  city: z.string().optional().describe("City name"),
  country: z.string().optional().describe("Country name"),
  effort_level: z
    .union([z.number(), z.enum(["1", "2", "3"])])
    .optional()
    .describe("Effort level (1: easy, 2: medium, 3: hard)"),
  price: z.number().optional().describe("Price of the listing"),
  street_address: z
    .string()
    .optional()
    .describe("Street address of the listing"),
});

export const webSearchResponseSchema = z.object({
  id: z.string().optional(),
  city: z.string().describe("City name"),
  country: z.string().describe("Country name"),
  street_address: z.string().describe("Street address of the listing"),
  price: z.number().describe("Price of the listing"),
});

export type SearchResponse = z.infer<typeof searchResponseSchema>;
export type WebSearchResponse = z.infer<typeof webSearchResponseSchema>;
