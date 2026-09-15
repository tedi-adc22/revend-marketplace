import CategoryPage from "@/components/CategoryPageUI/CategoryPage";
import { getFilteredListings } from "@/lib/actions/data";

export default async function AllCategoryPage({ searchParams }) {
  const sParams = await searchParams;

  const currentPage = Math.max(1, parseInt(sParams.page || "1", 10));

  const { listings, count, totalPages, maxDatabasePrice, error } =
    await getFilteredListings({
      baseFilterFn: (q) => q.eq("status", "active"),
      page: currentPage,
      minPrice: sParams.minPrice ? Number(sParams.minPrice) : null,
      maxPrice: sParams.maxPrice ? Number(sParams.maxPrice) : null,
      condition: sParams.condition !== "All" ? sParams.condition : null,
      sort: sParams.sort || "Newest",
    });

  if (error) console.error("Error fetching all listings:", error.message);

  return (
    <CategoryPage
      category="all"
      initialListings={listings}
      currentPage={currentPage}
      totalPages={totalPages}
      totalResults={count}
      maxPrice={maxDatabasePrice}
    />
  );
}
