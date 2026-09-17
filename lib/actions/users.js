"use server";

import { createSupabaseClient } from "@/lib/supabase/server";
import { getErrorMessage } from "@/lib/utils";
import { headers } from "next/headers";

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 72; // Recommended limit for bcrypt hashing
const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function createAccountAction(formData) {
  try {
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();
    const userName = formData.get("userName")?.toString().trim();

    // 1. Input Presence Check
    if (!email || !password || !userName) {
      return { errorMessage: "All fields are required." };
    }

    // 2. Email Validation
    if (!EMAIL_REGEX.test(email)) {
      return { errorMessage: "Please provide a valid email address." };
    }

    // 3. Password Length Check
    if (password.length < MIN_PASSWORD_LENGTH) {
      return {
        errorMessage: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
      };
    }
    if (password.length > MAX_PASSWORD_LENGTH) {
      return { errorMessage: "Password is too long." };
    }

    // 4. Username Format Check
    if (!USERNAME_REGEX.test(userName)) {
      return {
        errorMessage:
          "Username must be 3-20 characters long and contain only letters, numbers, underscores, or hyphens.",
      };
    }

    const { auth } = await createSupabaseClient();

    const { error } = await auth.signUp({
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
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      return { errorMessage: "Email and password are required." };
    }

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
    const email = formData.get("email")?.toString().trim();

    if (!email || !EMAIL_REGEX.test(email)) {
      return {
        errorMessage: "Please enter a valid email address.",
        successMessage: null,
      };
    }

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
    const newPassword = formData.get("password")?.toString();

    if (!newPassword || newPassword.length < MIN_PASSWORD_LENGTH) {
      return {
        errorMessage: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
        success: false,
      };
    }

    const supabase = await createSupabaseClient();

    // Supabase automatically establishes a recovery session via magic link cookie
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    return { errorMessage: null, success: true };
  } catch (error) {
    console.error("updatePasswordFromReset error:", error);
    return {
      errorMessage: error.message || "Something went wrong",
      success: false,
    };
  }
}

// Future use on /account settings (Requires Current Password Verification)
export async function changePasswordInApp(formData) {
  try {
    const currentPassword = formData.get("currentPassword")?.toString();
    const newPassword = formData.get("newPassword")?.toString();

    if (!currentPassword || !newPassword) {
      return { errorMessage: "Both current and new passwords are required." };
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      return {
        errorMessage: `New password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
      };
    }

    const supabase = await createSupabaseClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { errorMessage: "You must be signed in to perform this action." };
    }

    // 1. Re-authenticate user with current password before allowing change
    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (reauthError) {
      return { errorMessage: "Incorrect current password." };
    }

    // 2. Update to new password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) throw updateError;

    return { errorMessage: null, success: true };
  } catch (error) {
    console.error("changePasswordInApp error:", error);
    return {
      errorMessage: error.message || "Something went wrong",
      success: false,
    };
  }
}
