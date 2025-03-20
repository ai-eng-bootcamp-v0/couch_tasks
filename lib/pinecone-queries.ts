import { createClient } from "@/utils/supabase/server";
import { namespace } from "./pinecone-wrapper";
import { Listing } from "./get-listings";

export async function getPineconeListings(
  searchQuery: string
): Promise<Listing[] | null> {
  if (!searchQuery || searchQuery.trim() === "") {
    return null;
  }

  try {
    const supabase = await createClient();

    const response = await namespace.searchRecords({
      query: {
        topK: 2,
        inputs: { text: searchQuery },
      },
      fields: ["listing_id"],
    });

    if (response.result.hits.length === 0) {
      return null;
    }

    const listingIds = response.result.hits
      .map((hit) => {
        const listingId =
          hit.fields && typeof hit.fields === "object"
            ? (hit.fields as Record<string, unknown>).listing_id
            : null;
        return typeof listingId === "string" ? listingId : null;
      })
      .filter((id): id is string => id !== null);

    if (listingIds.length === 0) {
      return null;
    }

    const { data: pineconeListings, error } = await supabase
      .from("listings")
      .select()
      .in("id", listingIds);

    if (error) {
      console.error("Pinecone listings database query error:", error);
      return null;
    }

    return pineconeListings || null;
  } catch (error) {
    console.error("Pinecone query failed:", error);
    return null;
  }
}
