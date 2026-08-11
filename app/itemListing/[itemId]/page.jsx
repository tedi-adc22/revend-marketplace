import ItemListingPage from "@/components/itemlisting/ItemListing";
import { notFound } from "next/navigation";
import { MOCK_ITEMS } from "@/lib/MOCK_ITEMS";

async function getItem(itemId) {
  // Absolute URL is required when fetching on the server
  // const res = await fetch(`http://localhost:3000/api/dataFolder/${itemId}`, {
  //   cache: "no-store", // Ensures fresh data or use revalidate
  // });

  const res = await fetch(`http://localhost:3000/api/superTest1/${itemId}`, {
    cache: "no-store", // Ensures fresh data or use revalidate
  });

  console.log("Response from API:", res);

  if (!res.ok) {
    const text = await res.text();
    // console.log("error body:", text);
    return null;
  }
  return res.json();
}

export default async function itemListing({ params }) {
  const { itemId } = await params;

  // const item = await getItem(itemId);
  const item = MOCK_ITEMS.find((item) => item.id === itemId);

  if (!item) {
    notFound();
  }
  console.log("The fetched item:", item);

  return (
    <div>
      <ItemListingPage itemId={itemId} item={item} />
    </div>
  );
}
