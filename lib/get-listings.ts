import { cache } from "react";
import { createClient } from "@/utils/supabase/server";
import { aiSearch } from "./ai-search";
import { namespace } from "./pinecone-wrapper";

export interface Listing {
  id: string;
  city?: string;
  country?: string;
  effort_level?: number;
  [key: string]: any;
}

export type GetListingsResult = {
  regular: Listing[];
  from_pinecone: Listing[] | null;
};

export const getListings = cache(async (searchQuery?: string) => {
  const supabase = await createClient();
  let query = supabase.from("listings").select();

  if (searchQuery) {
    try {
      const searchParams = await aiSearch(searchQuery);

      if (searchParams.city) {
        query = query.ilike("city", `%${searchParams.city}%`);
      }
      if (searchParams.country) {
        query = query.ilike("country", `%${searchParams.country}%`);
      }
      if (searchParams.effort_level) {
        query = query.eq("effort_level", parseInt(searchParams.effort_level));
      }
    } catch (error) {
      console.error("Error in search:", error);
    }
  }

  try {
    const { data: listings, error } = await query;
    let listings_pinecone = null;

    // Send to Pinecone
    if (searchQuery && searchQuery.trim() !== "") {
      const response = await namespace.searchRecords({
        query: {
          topK: 2,
          inputs: { text: searchQuery },
        },
        fields: ["listing_id"],
      });

      if (response.result.hits.length > 0) {
        const listingIds = response.result.hits
          .map((hit) => {
            const listingId =
              hit.fields && typeof hit.fields === "object"
                ? (hit.fields as Record<string, unknown>).listing_id
                : null;
            return typeof listingId === "string" ? listingId : null;
          })
          .filter((id): id is string => id !== null);

        if (listingIds.length > 0) {
          const { data: pineconeListings } = await supabase
            .from("listings")
            .select()
            .in("id", listingIds);

          listings_pinecone = pineconeListings;
        }
      }

      if (error) {
        console.error("Database query error:", error);
        return { regular: [], from_pinecone: null } as GetListingsResult;
      }
    }

    return {
      regular: listings || [],
      from_pinecone: listings_pinecone,
    } as GetListingsResult;
  } catch (dbError) {
    console.error("Database operation failed:", dbError);
    return { regular: [], from_pinecone: null } as GetListingsResult;
  }
});
