import CategoryPage from "@/components/CategoryPageUI/CategoryPage";
import { createSupabaseClient } from "@/lib/supabase/server";

const PAGE_SIZE = 12;

export default async function SearchPage({ searchParams }) {
  const sParams = await searchParams;

  const searchQuery = sParams?.q?.trim() || "";
  const currentPage = Math.max(1, parseInt(sParams?.page || "1", 10));
  const minPrice = sParams.minPrice ? Number(sParams.minPrice) : null;
  const maxPrice = sParams.maxPrice ? Number(sParams.maxPrice) : null;
  const condition =
    sParams.condition && sParams.condition !== "All" ? sParams.condition : null;
  const sort = sParams.sort || "Newest";

  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createSupabaseClient();

  // If there's no search term, don't hit the DB at all — just show empty state
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

  // Ceiling for the slider — highest price among listings matching this search,
  // unaffected by whatever price filter the user has applied.
  const { data: maxPriceItem } = await supabase
    .from("listings")
    .select("price")
    .eq("status", "active")
    .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
    .order("price", { ascending: false })
    .limit(1)
    .maybeSingle();

  const maxDatabasePrice = maxPriceItem?.price
    ? Math.ceil(Number(maxPriceItem.price))
    : 1000;

  // Build the actual filtered/sorted/paginated query
  let query = supabase
    .from("listings")
    .select("*, seller:profiles(username)", { count: "exact" })
    .eq("status", "active")
    .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);

  if (minPrice !== null) query = query.gte("price", minPrice);
  if (maxPrice !== null) query = query.lte("price", maxPrice);
  if (condition) query = query.eq("condition", condition);

  if (sort === "Price Low") {
    query = query.order("price", { ascending: true });
  } else if (sort === "Price High") {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data: listings, count, error } = await query.range(from, to);

  if (error) {
    console.error("Error fetching search results:", error.message);
  }

  const totalPages = Math.ceil((count || 0) / PAGE_SIZE);

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
