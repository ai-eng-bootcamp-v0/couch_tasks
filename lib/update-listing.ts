"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidateListings, revalidateSearch } from "./get-listings";

export async function updateListing(id: string, data: any) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("listings").update(data).eq("id", id);

    if (error) {
      throw new Error(`Failed to update listing: ${error.message}`);
    }

    await revalidateListings();

    if (data.city) {
      await revalidateSearch(data.city);
    }
    if (data.country) {
      await revalidateSearch(data.country);
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating listing:", error);
    return { success: false, error: (error as Error).message };
  }
}
