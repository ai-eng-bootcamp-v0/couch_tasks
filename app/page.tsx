import ListingsGrid from "@/components/listings-grid";
import SearchBar from "@/components/search-bar";
import SyncButton from "@/components/sync-button";
import {
  getListings,
  Listing as ApiListing,
  GetListingsResult,
} from "@/lib/get-listings";
import { Listing as ModelListing } from "@/models/listing";
import { EffortLevel } from "@/models/listing";
import { getAIRouterDecision } from "@/lib/ai-router";

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const convertToModelListing = (listing: ApiListing): ModelListing => {
  return {
    id: listing.id,
    city: listing.city || "",
    country: listing.country || "",
    effort_level: (listing.effort_level || 1) as EffortLevel,
    image_url: listing.image_url,
    description: listing.description,
  };
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const searchQuery = params.q as string | undefined;

  let listings: GetListingsResult;

  if (!searchQuery) {
    listings = { regular: [], from_pinecone: null };
  } else {
    listings = await getAIRouterDecision(searchQuery);
  }

  const { regular, from_pinecone } = listings;

  const convertedRegular = regular.map(convertToModelListing);
  const convertedPinecone = from_pinecone
    ? from_pinecone.map(convertToModelListing)
    : [];

  const hasNoListings =
    convertedRegular.length === 0 && convertedPinecone.length === 0;

  if (hasNoListings) {
    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <div className="flex items-center gap-4 w-full justify-between">
            <SearchBar initialQuery={searchQuery} />
            <SyncButton />
          </div>
          <div className="mt-8 text-neutral-600">
            No listings found for your search
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full">
        <div className="flex items-center gap-4 w-full justify-between">
          <SearchBar initialQuery={searchQuery} />
          <SyncButton />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {convertedRegular.length > 0 && (
            <div>
              <h2 className="text-xl font-medium mb-4">Regular Listings</h2>
              <ListingsGrid listings={convertedRegular} />
            </div>
          )}

          {convertedPinecone.length > 0 && (
            <div>
              <h2 className="text-xl font-medium mb-4">
                Vector Search Results
              </h2>
              <ListingsGrid listings={convertedPinecone} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
