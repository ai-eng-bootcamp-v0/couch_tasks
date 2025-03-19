import { type SearchResponse } from "@/models/ai-schemas";

export default async function searchToKeywords(
  search: string
): Promise<SearchResponse> {
  if (!search || search.trim() === "") {
    console.log("Empty search query, returning empty object");
    return {};
  }

  try {
    const baseUrl = process.env.VERCEL_URL; // built-in const

    const apiUrl = `${baseUrl}/api/chat`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: search,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(`Search API error (${response.status}):`, errorText);
      return {};
    }

    const data = await response.json().catch((err) => {
      console.error("Failed to parse JSON response:", err);
      return {};
    });

    return data;
  } catch (error) {
    console.error("Error in searchToKeywords:", error);
    return {};
  }
}
