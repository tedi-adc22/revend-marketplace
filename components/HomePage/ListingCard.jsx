"use client";
import Link from "next/link";
import Image from "next/image";

export const ListingCard = ({ listing }) => {
  const imageSrc =
    Array.isArray(listing.images) && listing.images.length > 0
      ? listing.images[0]
      : null;

  return (
    <Link href={`/item/${listing.id}`} className="flex flex-col group">
      <div className="flex flex-col">
        {/* Image Container */}
        <div className="relative w-full aspect-square rounded-2xl bg-gray-100 overflow-hidden flex items-center justify-center">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={listing.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 20vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            /* Fallback placeholder if no image exists */
            <div className="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 font-medium text-sm">
              No Image
            </div>
          )}

          {/* Favorite Heart Button */}
          <button
            type="button"
            aria-label="Add to favorites"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-md hover:scale-105 active:scale-95 transition-transform z-10"
          >
            <svg
              className="w-5 h-5 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.684a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        {/* Listing Details */}
        <div className="mt-3 space-y-1.5 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-medium text-base text-gray-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
              {listing.title}
            </h3>

            <p className="text-lg font-bold text-gray-900 mt-1">
              €{Number(listing.price || 0).toFixed(2)}
            </p>
          </div>

          {listing.location && (
            <div className="flex items-center gap-1 text-xs text-gray-500 pt-1">
              <svg
                className="w-3.5 h-3.5 shrink-0 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="truncate">{listing.location}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
