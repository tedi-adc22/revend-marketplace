import { getHomeListings } from "@/lib/actions/data";
import { ListingCard } from "./ListingCard";
import { PlusCircle, Search } from "lucide-react";
import Link from "next/link";

function HeroBanner({ user }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl text-white shadow-sm">
      <div className="px-6 py-10 sm:py-12 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Content */}
        <div className="max-w-xl text-center md:text-left space-y-4">
          <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-blue-100">
            Local Resell Marketplace
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Buy & Sell pre-owned goods effortlessly.
          </h1>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            Turn your unused items into cash or discover great deals on quality
            gear right in your neighborhood.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
            <Link
              href="/account"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-full shadow-sm transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Post a Listing
            </Link>
            <Link
              href="/category/all"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 hover:bg-gray-100 font-semibold text-sm rounded-full shadow-sm transition-colors"
            >
              <Search className="w-4 h-4 text-gray-500" />
              Explore Listings
            </Link>
          </div>
        </div>

        {/* Right Stats / Badges */}
        <div className="grid grid-cols-2 gap-4 w-full md:w-auto shrink-0">
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl text-center">
            <span className="block text-2xl font-bold">100%</span>
            <span className="text-xs text-blue-100">Verified Listings</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl text-center">
            <span className="block text-2xl font-bold">Direct</span>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
      {listings.map((listing, index) => (
        <ListingCard key={listing.id} listing={listing} index={index} />
      ))}
    </div>
  );
};

export default async function MainContent() {
  const listings = await getHomeListings(10);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Banner Section */}
      <HeroBanner />

      {/* Hot Listings Section */}
      <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Most viewed items this week
          </h2>
          <a
            href="/category/all"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            View all
          </a>
        </div>

        <MarketplaceGrid listings={listings} />
      </section>
    </main>
  );
}
