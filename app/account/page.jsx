// const MOCK_USER = {
//   username: "alex_r",
//   email: "alex.r@example.com",
//   avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
//   isPremium: false,
//   listingLimit: 5,
// };
import {
  createSupabaseClient,
  getUser,
  getUserListings,
} from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AccountPageClient from "@/components/account/AccountPageClient";

export default async function AccountPage() {
  const user = await getUser();

  if (!user) {
    redirect("/signin");
  }

  const supabase = await createSupabaseClient();

  const [{ data: profile }, listings] = await Promise.all([
    supabase
      .from("profiles")
      .select("is_premium, username")
      .eq("id", user.id)
      .single(),
    getUserListings(user.id),
  ]);

  const isPremium = profile?.is_premium || false;
  const username =
    profile?.username || user.user_metadata?.userName || "no username";

  return (
    <AccountPageClient
      user={user}
      listings={listings || []}
      isPremium={isPremium}
      username={username}
    />
  );
}
