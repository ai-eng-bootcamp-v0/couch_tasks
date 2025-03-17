import { Heart } from "lucide-react";
import Image from "next/image";
import { EffortLevel, Listing } from "@/models/listing";

interface ListingCardProps {
  listing: Listing;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
}

export default function ListingCard({
  listing,
  isFavorite,
  onFavoriteToggle,
}: ListingCardProps) {
  const renderEffortLevel = (level: EffortLevel) => {
    return Array(level)
      .fill(0)
      .map((_, i) => (
        <span key={i} className="text-yellow-500">
          ★
        </span>
      ));
  };

  return (
    <div className="group">
      <div className="relative aspect-square rounded-xl overflow-hidden">
        {listing.image_url ? (
          <Image
            src={listing.image_url}
            alt={`${listing.city}, ${listing.country}`}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500 text-sm">{listing.city}</span>
          </div>
        )}

        <button
          onClick={onFavoriteToggle}
          className="absolute top-3 right-3 p-2 rounded-full"
        >
          <Heart
            className={`h-6 w-6 ${
              isFavorite ? "fill-rose-500 text-rose-500" : "text-white"
            }`}
          />
        </button>
      </div>

      <div className="mt-2">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-900">
            {listing.city}, {listing.country}
          </h3>
        </div>

        <div className="mt-1 text-xs text-gray-500">
          Effort level: {renderEffortLevel(listing.effort_level)}
        </div>
      </div>
    </div>
  );
}
