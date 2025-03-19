import ListingsGrid from "@/components/listings-grid";
import SearchBar from "@/components/search-bar";
import { getListings } from "@/lib/get-listings";

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const searchQuery = params.q as string | undefined;

  const listings = await getListings(searchQuery);

  if (!listings || listings.length === 0) {
    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <SearchBar initialQuery={searchQuery} />
          <div className="mt-8 text-neutral-600">
            No listings found for your search
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <SearchBar initialQuery={searchQuery} />
        <ListingsGrid listings={listings} />
      </main>
    </div>
  );
}
