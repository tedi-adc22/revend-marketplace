import ItemListingPage from "@/components/itemlisting/itemlisting";
import { notFound } from "next/navigation";

async function getItem(itemId) {
  // Absolute URL is required when fetching on the server
  const res = await fetch(`http://localhost:3000/api/dataFolder/${itemId}`, {
    cache: "no-store", // Ensures fresh data or use revalidate
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function itemListing({ params }) {
  const { itemId } = await params;
  console.log(itemId);
  const item = await getItem(itemId);
  console.log("The fetched item:", item);

  return (
    <div>
      <ItemListingPage itemId={itemId} item={item} />
    </div>
  );
}
