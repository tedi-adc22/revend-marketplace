import CategoryPage from "@/components/CategoryPageUI/CategoryPage";
import { getFilteredListings } from "@/lib/actions/data";

// Replaces special chars so it doesn't break Postg
function sanitizeSearchTerm(term) {
  return term.replace(/[%,()]/g, "");
}

export default async function SearchPage({ searchParams }) {
  const sParams = await searchParams;
  const searchQuery = sanitizeSearchTerm(sParams?.q?.trim() || "");

  if (!searchQuery) {
    return (
      <CategoryPage
        category="search"
        initialListings={[]}
        currentPage={1}
        totalPages={1}
        totalResults={0}
        maxPrice={1000}
        searchQuery=""
      />
    );
  }

  const searchFilter = `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`;

  const currentPage = Math.max(1, parseInt(sParams.page || "1", 10));

  const { listings, count, totalPages, maxDatabasePrice, error } =
    await getFilteredListings({
      baseFilterFn: (q) => q.eq("status", "active").or(searchFilter),
      page: currentPage,
      minPrice: sParams.minPrice ? Number(sParams.minPrice) : null,
      maxPrice: sParams.maxPrice ? Number(sParams.maxPrice) : null,
      condition: sParams.condition !== "All" ? sParams.condition : null,
      sort: sParams.sort || "Newest",
    });

  if (error) console.error("Error fetching search results:", error.message);

  return (
    <CategoryPage
      category="search"
      initialListings={listings || []}
      currentPage={currentPage}
      totalPages={totalPages}
      totalResults={count || 0}
      maxPrice={maxDatabasePrice}
      searchQuery={searchQuery}
    />
  );
}
