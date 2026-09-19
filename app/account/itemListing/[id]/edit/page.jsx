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
    <div className="min-h-[calc(100dvh-3.5rem)] md:min-h-[calc(100dvh-4rem)] bg-gray-50 px-0 py-4 sm:px-0 sm:py-8">
      <EditListingForm initialListing={listing} />
    </div>
  );
}
