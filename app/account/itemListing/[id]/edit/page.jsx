import EditListingForm from "@/components/itemlisting/EditListingForm";
import { getListingById } from "@/lib/actions/data";
import { getUser } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";

export default async function EditListingPage({ params }) {
  const { id } = await params;

  const user = await getUser();

  if (!user) {
    redirect("/signin");
  }
  const { data: listing, error } = await getListingById(id);

  if (error || !listing || listing.seller_id !== user.id) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <EditListingForm initialListing={listing} />
    </div>
  );
}
