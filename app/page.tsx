import ListingsGrid from "@/components/listings-grid";
import SearchBar from "@/components/search-bar";
import searchToKeywords from "@/lib/search";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: listings } = await supabase.from("listings").select();

  if (!listings) {
    return <div>No listings found</div>;
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <SearchBar />
        <ListingsGrid listings={listings} />
      </main>
    </div>
  );
}
