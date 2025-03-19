"use server";

import { createClient } from "@/utils/supabase/server";

export async function updateListing(id: string, data: any) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("listings").update(data).eq("id", id);

    if (error) {
      throw new Error(`Failed to update listing: ${error.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating listing:", error);
    return { success: false, error: (error as Error).message };
  }
}
