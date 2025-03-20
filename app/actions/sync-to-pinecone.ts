"use server";

import { createClient } from "@/utils/supabase/server";
import { namespace } from "@/lib/pinecone-wrapper";
import { nanoid } from "nanoid";

export async function syncToPinecone() {
  try {
    const supabase = await createClient();
    const { data: listings, error } = await supabase.from("listings").select();

    if (error) {
      throw new Error(`Failed to fetch listings: ${error.message}`);
    }

    if (!listings || listings.length === 0) {
      return { success: false, message: "No listings found to sync" };
    }

    const formattedData = listings.map((listing) => ({
      id: `${listing.id}-${nanoid()}`,
      text: listing.description,
      listing_id: listing.id,
      city: listing.city,
      country: listing.country,
      effort_level: listing.effort_level,
    }));

    const response = await namespace.upsertRecords(formattedData);

    // revalidatePath("/");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error syncing to Pinecone:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
