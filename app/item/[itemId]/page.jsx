import ItemListingPage from "@/components/itemlisting/ItemListing";
import { notFound } from "next/navigation";
import { getListingById } from "@/lib/actions/data";
import { createSupabaseClient, getUser } from "@/lib/supabase/server";
import { headers } from "next/headers";

export async function generateMetadata({ params }) {
  const { itemId } = await params;
  const { data: listing } = await getListingById(itemId);

  if (!listing) {
    return { title: "Listing not found | Revend" };
  }

  return {
    title: `${listing.title} - €${listing.price} | Revend`,
    description: listing.description?.slice(0, 160),
  };
}

export default async function ListingPage({ params }) {
  const { itemId } = await params;
  const { data: item, error } = await getListingById(itemId);

  if (error || !item) {
    notFound();
  }

  // Get client IP address & current user for deduplication
  const headerList = await headers();
  const clientIp =
    headerList.get("x-forwarded-for")?.split(",")[0] ||
    headerList.get("x-real-ip") ||
    "127.0.0.1";

  const user = await getUser();
  const supabase = await createSupabaseClient();

  // Add unique view
  await supabase.rpc("increment_listing_view", {
    p_listing_id: itemId,
    p_user_id: user?.id || null,
    p_ip_address: clientIp,
  });

  return (
    <div>
      <ItemListingPage itemId={itemId} item={item} />
    </div>
  );
}
