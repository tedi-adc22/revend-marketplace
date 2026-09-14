import { getUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import NewListingForm from "@/components/itemlisting/NewListingForm";

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
