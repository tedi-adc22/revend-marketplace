// const MOCK_USER = {
//   username: "alex_r",
//   email: "alex.r@example.com",
//   avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
//   isPremium: false,
//   listingLimit: 5,
// };
import { getUser, getUserListings } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AccountPageClient from "@/components/account/AccountPageClient";

export default async function AccountPage() {
  const user = await getUser();

  if (!user) {
    redirect("/signin");
  }

  const listings = await getUserListings(user.id);

  return <AccountPageClient user={user} listings={listings || []} />;
}
