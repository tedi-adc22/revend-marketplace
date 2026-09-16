// SHOULD BE FETURES ITEMS
import { getHomeListings } from "@/lib/actions/data";
import { ListingCard } from "./ListingCard";

const featuredCategories = [
  { name: "Laptops", bg: "bg-gray-200" },
  { name: "Computer Parts", bg: "bg-gray-300" },
  { name: "Smartphones", bg: "bg-gray-200" },
  { name: "Tablets & eBooks", bg: "bg-gray-300" },
  { name: "Cameras & Lenses", bg: "bg-gray-200" },
];

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
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
};

export default async function MainContent() {
  const listings = await getHomeListings(10);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Categories Section */}
      <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-semibold mb-6">Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {featuredCategories.map((item, index) => (
            <a
              key={index}
              href="#"
              className="group flex flex-col items-center text-center space-y-3"
            >
              <div
                className={`w-32 h-32 rounded-xl ${item.bg} group-hover:opacity-90 transition-opacity flex items-center justify-center text-gray-400 text-sm font-medium`}
              >
                Image
              </div>
              <span className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                {item.name}
              </span>
            </a>
          ))}
        </div>
      </section>

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
