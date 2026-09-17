import Link from "next/link";
import { CATEGORIES } from "@/lib/constants/categories";

export default function CategoriesNavBar() {
  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="w-full px-4 mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex justify-center space-x-6 overflow-x-auto py-3 text-xs font-medium text-gray-600 whitespace-nowrap scrollbar-none">
          {CATEGORIES.map((category) => (
            <li key={category.value}>
              <Link
                href={`/category/${category.value}`}
                className={`hover:text-black transition-colors ${
                  category.value === "Sell"
                    ? "font-bold text-orange-600 hover:text-orange-700"
                    : ""
                }`}
              >
                {category.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
