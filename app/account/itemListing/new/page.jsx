import { getUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import NewListingForm from "@/components/itemlisting/NewListingForm";

export const metadata = {
  title: "Create a Listing | Revend",
  description: "Post a new item for sale on Revend.",
};

export default async function NewListingPage() {
  const user = await getUser();

  if (!user) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <NewListingForm />
    </div>
  );
}
