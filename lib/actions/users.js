"use server";

import { createSupabaseClient } from "@/lib/supabase/server";
import { getErrorMessage } from "@/lib/utils";

export async function createAccountAction(formData) {
  try {
    const email = formData.get("email");
    const password = formData.get("password");
    const userName = formData.get("userName");

    const { auth } = await createSupabaseClient();

    const { data, error } = await auth.signUp({
      email,
      password,
      options: { data: { userName } },
    });

    console.log("SIGNUP DATA:", data);
    console.log("SIGNUP ERROR:", error);

    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    console.error("createAccountAction error:", error);
    return getErrorMessage(error);
  }
}

export async function loginAction(formData) {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    const { auth } = await createSupabaseClient();

    const { error } = await auth.signInWithPassword({ email, password });

    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    console.error("loginAction error:", error);
    return getErrorMessage(error);
  }
}

export async function signOutAction() {
  try {
    const { auth } = await createSupabaseClient();

    const { error } = await auth.signOut();

    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    console.error("loginAction error:", error);
    return getErrorMessage(error);
  }
}
