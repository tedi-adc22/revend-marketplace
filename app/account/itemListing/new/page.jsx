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
    <div className="min-h-[calc(100dvh-3.5rem)] md:min-h-[calc(100dvh-4rem)] bg-gray-50 px-0 py-4 sm:px-0 sm:py-8">
      <NewListingForm />
    </div>
  );
}
