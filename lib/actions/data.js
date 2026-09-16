import { createSupabaseClient } from "@/lib/supabase/server";
import { cache } from "react";

const PAGE_SIZE = 12;

export const getListingById = cache(async (itemId) => {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from("listings")
    .select("*, seller:profiles!seller_id(username)")
    .eq("id", itemId)
    .single();

  return { data, error };
});

// Get home listings for home page and show
// the 10 most viewed listings weekly
export async function getHomeListings(limit = 10) {
  const supabase = await createSupabaseClient();

  const { data: listings, error } = await supabase
    .from("listings")
    .select("*")
    .order("weekly_view_count", { ascending: false, nullsFirst: false })
    .order("view_count", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching homepage listings:", error.message);
    return [];
  }

  return listings || [];
}

/**
 * Fetches a filtered/sorted/paginated slice of listings, plus the max
 * price across the whole matching set (for the price slider's ceiling).
 *
 * baseFilterFn: a function that applies the base filter (category, status,
 * or search) to a Supabase query builder — the one thing that legitimately
 * differs between category/all/search pages.
 */
export async function getFilteredListings({
  baseFilterFn,
  page = 1,
  minPrice = null,
  maxPrice = null,
  condition = null,
  sort = "Newest",
}) {
  const supabase = await createSupabaseClient();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let maxPriceQuery = supabase.from("listings").select("price");
  maxPriceQuery = baseFilterFn(maxPriceQuery)
    .order("price", { ascending: false })
    .limit(1)
    .maybeSingle();

  let listingsQuery = supabase
    .from("listings")
    .select("*, seller:profiles(username)", { count: "exact" });
  listingsQuery = baseFilterFn(listingsQuery);

  if (minPrice !== null) listingsQuery = listingsQuery.gte("price", minPrice);
  if (maxPrice !== null) listingsQuery = listingsQuery.lte("price", maxPrice);
  if (condition) listingsQuery = listingsQuery.eq("condition", condition);

  // Sorting logic
  if (sort === "Price Low") {
    listingsQuery = listingsQuery.order("price", { ascending: true });
  } else if (sort === "Price High") {
    listingsQuery = listingsQuery.order("price", { ascending: false });
  } else if (sort === "Most Popular") {
    listingsQuery = listingsQuery
      .order("weekly_view_count", { ascending: false, nullsFirst: false })
      .order("view_count", { ascending: false, nullsFirst: false });
  } else {
    listingsQuery = listingsQuery.order("created_at", { ascending: false });
  }

  listingsQuery = listingsQuery.range(from, to);

  const [{ data: maxPriceItem }, { data: listings, count, error }] =
    await Promise.all([maxPriceQuery, listingsQuery]);

  const maxDatabasePrice = maxPriceItem?.price
    ? Math.ceil(Number(maxPriceItem.price))
    : 1000;

  const totalPages = Math.ceil((count || 0) / PAGE_SIZE);

  return {
    listings: listings || [],
    count: count || 0,
    totalPages,
    maxDatabasePrice,
    error,
  };
}
