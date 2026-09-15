import {
  createSupabaseClient,
  getUser,
  getUserListings,
} from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AccountPageClient from "@/components/account/AccountPageClient";

export const metadata = {
  title: "My Account | Revend",
  description: "Manage your Revend profile, listings, and plan.",
};

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
