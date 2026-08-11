// SHOULD BE FETURES ITEMS
import { ListingCard } from "./ListingCard";
import { MOCK_ITEMS } from "@/lib/MOCK_ITEMS";

const featuredCategories = [
  { name: "Laptops", bg: "bg-gray-200" },
  { name: "Computer Parts", bg: "bg-gray-300" },
  { name: "Smartphones", bg: "bg-gray-200" },
  { name: "Tablets & eBooks", bg: "bg-gray-300" },
  { name: "Cameras & Lenses", bg: "bg-gray-200" },
];

const hotListings = [
  {
    id: 1,
    title: "Sony WH-1000XM4 Wireless Noise-Canceling Headphones",
    price: 185.0,
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    location: "Austin, TX",
    sellerId: 101,
    isPremium: true,
  },
  {
    id: 2,
    title: "Apple MacBook Air M2 (2022) - 8GB RAM, 256GB SSD",
    price: 799.0,
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    location: "Seattle, WA",
    sellerId: 102,
    isPremium: false,
  },
  {
    id: 3,
    title: "Fujifilm X-T30 II Mirrorless Camera with 18-55mm Lens",
    price: 650.0,
    imageUrl:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80",
    location: "Denver, CO",
    sellerId: 103,
    isPremium: true,
  },
  {
    id: 4,
    title: "Keychron K2 Wireless Mechanical Keyboard (RGB)",
    price: 65.0,
    imageUrl:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    location: "Chicago, IL",
    sellerId: 104,
    isPremium: false,
  },
  {
    id: 5,
    title: "Herman Miller Aeron Chair - Size B (Fully Loaded)",
    price: 520.0,
    imageUrl:
      "https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=600&auto=format&fit=crop&q=80",
    location: "San Francisco, CA",
    sellerId: 105,
    isPremium: true,
  },
  {
    id: 6,
    title: "Nintendo Switch OLED Model - White Set",
    price: 260.0,
    imageUrl:
      "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600&auto=format&fit=crop&q=80",
    location: "New York, NY",
    sellerId: 106,
    isPremium: false,
  },
  {
    id: 7,
    title: "Leather Minimalist Daily Backpack (Dark Brown)",
    price: 90.0,
    imageUrl:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    location: "Portland, OR",
    sellerId: 107,
    isPremium: false,
  },
  {
    id: 8,
    title: "Sonos Move Portable Smart Speaker (Black)",
    price: 210.0,
    imageUrl:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80",
    location: "Miami, FL",
    sellerId: 108,
    isPremium: true,
  },
];

const MarketplaceGrid = ({ hotListings }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {hotListings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
};

export default function MainContent() {
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
            Hot items right now / Most viewed this week
          </h2>
          <a
            href="#"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            View all
          </a>
        </div>

        <MarketplaceGrid hotListings={MOCK_ITEMS} />
      </section>
    </main>
  );
}
