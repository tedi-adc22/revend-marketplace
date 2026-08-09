"use client";

const categories = [
  "Saved",
  "Electronics",
  "Motors",
  "Fashion",
  "Collectibles & Art",
  "Sports",
  "Health & Beauty",
  "Industrial Equipment",
  "Home & Garden",
  "Deals",
  "Sell",
];

export default function CategoriesNavBar() {
  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="w-full px-4 mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex justify-center space-x-6 overflow-x-auto py-3 text-xs font-medium text-gray-600 whitespace-nowrap scrollbar-none">
          {categories.map((category, index) => (
            <li key={index}>
              <a
                href="#"
                className={`hover:text-black transition-colors ${
                  category === "Sell"
                    ? "font-bold text-orange-600 hover:text-orange-700"
                    : ""
                }`}
              >
                {category}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
