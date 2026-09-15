import ItemListingPage from "@/components/itemlisting/ItemListing";
import { notFound } from "next/navigation";
import { getListingById } from "@/lib/actions/data";

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

  return (
    <div>
      <ItemListingPage itemId={itemId} item={item} />
    </div>
  );
}
