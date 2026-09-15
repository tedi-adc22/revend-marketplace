import { getUser } from "@/lib/supabase/server";
import TopHeader from "./TopHeader";

export default async function TopHeaderServer() {
  const user = await getUser();
  return <TopHeader user={user} />;
}
