import EditListingForm from "@/components/itemlisting/EditListingForm";
import { getUser, createSupabaseClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";

export default async function EditListingPage({ params }) {
  const { id } = await params;
  console.log(id);
  const user = await getUser();

  if (!user) {
    redirect("/signin");
  }

  const supabase = await createSupabaseClient();

  // Fetch listing by ID
  const { data: listing, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !listing || listing.seller_id !== user.id) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <EditListingForm initialListing={listing} />
    </div>
  );
}
