import { cache } from "react";
import { createClient } from "@/utils/supabase/server";
import { aiSearch } from "./ai-search";
import { connection } from "next/server";

export const getListings = cache(async (searchQuery?: string) => {
  if (process.env.NODE_ENV === "development") {
    await connection();
  }

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

  const { data: listings, error } = await query;

  if (error) {
    console.error("Database query error:", error);
    return [];
  }

  return listings || [];
});
