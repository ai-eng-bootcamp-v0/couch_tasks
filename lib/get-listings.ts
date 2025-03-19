import { cache } from "react";
import { createClient } from "@/utils/supabase/server";
import { aiSearch } from "./ai-search";

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

    if (error) {
      console.error("Database query error:", error);
      return [];
    }

    return listings || [];
  } catch (dbError) {
    console.error("Database operation failed:", dbError);
    return [];
  }
});
