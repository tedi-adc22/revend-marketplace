import { createSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function getSafeRedirectPath(next) {
  if (
    typeof next === "string" &&
    next.startsWith("/") &&
    !next.startsWith("//")
  ) {
    return next;
  }
  return "/";
}

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = getSafeRedirectPath(searchParams.get("next"));
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (error) {
    return NextResponse.redirect(
      `${origin}/signin?error=${encodeURIComponent(errorDescription || error)}`,
    );
  }

  if (code) {
    const { auth } = await createSupabaseClient();
    const { error } = await auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(
    `${origin}/signin?error=Invalid%20or%20expired%20link`,
  );
}
