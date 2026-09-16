import { createSupabaseClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  const { itemId } = await params;
  const cookieStore = await cookies();
  const viewedCookieKey = `viewed_listing_${itemId}`;

  // Prevent duplicate counts within 24 hours using a cookie
  if (cookieStore.get(viewedCookieKey)) {
    return NextResponse.json({ counted: false, reason: "Already counted" });
  }

  const supabase = await createSupabaseClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub || null;

  const { error } = await supabase.rpc("increment_listing_view", {
    p_listing_id: itemId,
    p_user_id: userId,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Set a 72-hour cookie to prevent re-counting this user/browser
  const response = NextResponse.json({ counted: true });
  response.cookies.set(viewedCookieKey, "true", {
    maxAge: 60 * 60 * 72, // 72 hours
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return response;
}
