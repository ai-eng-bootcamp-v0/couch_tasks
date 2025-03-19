import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { searchResponseSchema } from "@/models/ai-schemas";
import { NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: Request) {
  console.log("Chat API route called");

  try {
    const body = await req.json();
    const { query } = body;

    console.log("Processing search query:", query);

    if (!query) {
      return NextResponse.json(
        { error: "Missing query parameter" },
        { status: 400 }
      );
    }

    const result = streamObject({
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

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error in chat API route:", error);

    return NextResponse.json(
      { error: "Failed to process search" },
      { status: 500 }
    );
  }
}
