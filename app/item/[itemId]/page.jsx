import ItemListingPage from "@/components/itemlisting/ItemListing";
import { notFound } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/server";

export default async function ListingPage({ params }) {
  const { itemId } = await params;

  const supabase = await createSupabaseClient();

  // Fetch listing directly from Supabase DB on the server
  const { data: item, error } = await supabase
    .from("listings")
    .select("*, seller:profiles!seller_id(username)")
    .eq("id", itemId)
    .single();

  if (error || !item) {
    notFound();
  }

  return (
    <div>
      <ItemListingPage itemId={itemId} item={item} />
    </div>
  );
}
