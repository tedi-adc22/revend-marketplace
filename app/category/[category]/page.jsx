import CategoryPage from "@/components/CategoryPageUI/CategoryPage";
import { createSupabaseClient } from "@/lib/supabase/server";

export default async function Category({ params }) {
  const { category } = await params;
  const supabase = await createSupabaseClient();

  // Query Supabase directly using the hyphenated category slug (e.g. "apparel-and-accessories")
  const { data: listings, error } = await supabase
    .from("listings")
    .select("*, seller:profiles(username)")
    .eq("category", category)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching category listings:", error.message);
  }
  console.log(listings);

  return <CategoryPage category={category} initialListings={listings || []} />;
}
