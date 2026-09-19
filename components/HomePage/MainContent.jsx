import { getHomeListings } from "@/lib/actions/data";
import { ListingCard } from "./ListingCard";
import { PlusCircle, Search } from "lucide-react";
import Link from "next/link";

function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl text-white shadow-sm">
      <div className="px-5 py-8 sm:px-6 sm:py-12 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
        {/* Left Content */}
        <div className="w-full max-w-xl text-center md:text-left space-y-4">
          <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-blue-100">
            Local Resell Marketplace
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Buy & Sell pre-owned goods effortlessly.
          </h1>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            Turn your unused items into cash or discover great deals on quality
            gear right in your neighborhood.
          </p>

          {/* Action Buttons: full-width stacked on phones */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center sm:justify-center md:justify-start gap-3 pt-2">
            <Link
              href="/account"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 bg-white hover:bg-gray-100 text-gray-900 font-semibold text-sm rounded-full shadow-sm transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-gray-500" />
              Post a Listing
            </Link>
            <Link
              href="/category/all"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 bg-white text-gray-900 hover:bg-gray-100 font-semibold text-sm rounded-full shadow-sm transition-colors"
            >
              <Search className="w-4 h-4 text-gray-500" />
              Explore Listings
            </Link>
          </div>
        </div>

        {/* Right Stats / Badges */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full md:w-auto shrink-0">
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3 sm:p-4 rounded-xl text-center">
            <span className="block text-xl sm:text-2xl font-bold">100%</span>
            <span className="text-xs text-blue-100">Verified Listings</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3 sm:p-4 rounded-xl text-center">
            <span className="block text-xl sm:text-2xl font-bold">Direct</span>
            <span className="text-xs text-blue-100">Local Deals</span>
          </div>
        </div>
      </div>
    </section>
  );
}

const MarketplaceGrid = ({ listings }) => {
  if (!listings || listings.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        No active listings found right now.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
      {listings.map((listing, index) => (
        <ListingCard key={listing.id} listing={listing} preload={index < 2} />
      ))}
    </div>
  );
};

export default async function MainContent() {
  const listings = await getHomeListings(10);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-10">
      <HeroBanner />

      <section className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-2xl font-semibold text-gray-900">
            Most viewed items this week
          </h2>
          <Link
            href="/category/all"
            className="shrink-0 text-sm font-medium text-blue-600 hover:underline"
          >
            View all
          </Link>
        </div>

        <MarketplaceGrid listings={listings} />
      </section>
    </div>
  );
}
