"use server";

import { createSupabaseClient } from "@/lib/supabase/server";
import { getErrorMessage } from "@/lib/utils";
import { headers } from "next/headers";

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

    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    console.error("createAccountAction error:", error);
    return { errorMessage: error.message || "Something went wrong" };
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
    return { errorMessage: error.message || "Something went wrong" };
  }
}

export async function signOutAction() {
  try {
    const { auth } = await createSupabaseClient();

    const { error } = await auth.signOut();

    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    console.error("signOutAction error:", error);
    return { errorMessage: error.message || "Something went wrong" };
  }
}

export async function requestPasswordReset(formData) {
  try {
    const email = formData.get("email");
    const { auth } = await createSupabaseClient();
    const origin = (await headers()).get("origin");

    const { error } = await auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/reset-password`,
    });

    if (error) throw error;

    return {
      errorMessage: null,
      successMessage: "Password reset link sent to your email.",
    };
  } catch (error) {
    console.error("requestPasswordReset error:", error);
    return {
      errorMessage: error.message || "Something went wrong",
      successMessage: null,
    };
  }
}

export async function updatePassword(formData) {
  try {
    const newPassword = formData.get("password");
    const { auth } = await createSupabaseClient();

    const { error } = await auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    return { errorMessage: null, success: true };
  } catch (error) {
    console.error("updatePassword error:", error);
    return {
      errorMessage: error.message || "Something went wrong",
      success: false,
    };
  }
}
