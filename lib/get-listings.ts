import { cache } from "react";
import { createClient } from "@/utils/supabase/server";
import { getPineconeListings } from "./pinecone-queries";
import { SearchResponse } from "@/models/ai-schemas";

export type Listing = SearchResponse & {
  id: string;
  image_url?: string;
  description?: string;
};

export type GetListingsResult = {
  regular: Listing[];
  from_pinecone: Listing[] | null;
};

export const getListings = cache(
  async (searchParams?: SearchResponse, searchQuery?: string) => {
    const supabase = await createClient();
    let query = supabase.from("listings").select();

    if (searchParams) {
      try {
        if (searchParams.city) {
          query = query.ilike("city", `%${searchParams.city}%`);
        }
        if (searchParams.country) {
          query = query.ilike("country", `%${searchParams.country}%`);
        }
        if (searchParams.effort_level) {
          const effortLevel =
            typeof searchParams.effort_level === "string"
              ? parseInt(searchParams.effort_level)
              : searchParams.effort_level;
          query = query.eq("effort_level", effortLevel);
        }
      } catch (error) {
        console.error("Error in search:", error);
      }
    }

    try {
      // Run both queries in parallel
      const [regularQueryResult, pineconeListings] = await Promise.all([
        query,
        searchQuery ? getPineconeListings(searchQuery) : null,
      ]);

      const { data: listings, error } = regularQueryResult;

      if (error) {
        console.error("Database query error:", error);
        return { regular: [], from_pinecone: null } as GetListingsResult;
      }

      return {
        regular: listings || [],
        from_pinecone: pineconeListings,
      } as GetListingsResult;
    } catch (dbError) {
      console.error("Database operation failed:", dbError);
      return { regular: [], from_pinecone: null } as GetListingsResult;
    }
  }
);
