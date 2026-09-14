"use server";

import { createSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const FREE_LISTINGS_PER_DAY = 5;
const PREMIUM_LISTINGS_PER_DAY = 20;
const WINDOW_HOURS = 24;
const FREE_LISTING_CAP = 5;

function checkListingLimit(profile) {
  const now = new Date();
  const windowStart = new Date(profile.listing_window_start);
  const hoursSinceWindowStart = (now - windowStart) / (1000 * 60 * 60);
  const windowExpired = hoursSinceWindowStart >= WINDOW_HOURS;

  const limit = profile.is_premium
    ? PREMIUM_LISTINGS_PER_DAY
    : FREE_LISTINGS_PER_DAY;
  const currentCount = windowExpired ? 0 : profile.listing_count_in_window;

  if (currentCount >= limit) {
    const hoursLeft = Math.ceil(WINDOW_HOURS - hoursSinceWindowStart);
    return {
      allowed: false,
      errorMessage: `You've reached your limit of ${limit} listings today. Try again in ${hoursLeft} hour(s)${
        !profile.is_premium ? ", or upgrade to Premium for 20/day" : ""
      }.`,
    };
  }

  return {
    allowed: true,
    nextCount: windowExpired ? 1 : profile.listing_count_in_window + 1,
    nextWindowStart: windowExpired
      ? now.toISOString()
      : profile.listing_window_start,
  };
}

async function checkActiveListingCap(supabase, userId, isPremium) {
  const { count, error } = await supabase
    .from("listings")
    .select("id", { count: "exact", head: true })
    .eq("seller_id", userId);

  if (error) {
    return {
      allowed: false,
      errorMessage: "Could not check your listing count.",
    };
  }

  const cap = isPremium ? PREMIUM_LISTING_CAP : FREE_LISTING_CAP;

  if (count >= cap) {
    return {
      allowed: false,
      errorMessage: `You can only have ${cap} listings at a time.${
        !isPremium
          ? " Upgrade to Premium for up to 20."
          : " Delete an existing listing to add a new one."
      }`,
    };
  }

  return { allowed: true };
}

export async function createListingAction(formData) {
  try {
    const supabase = await createSupabaseClient();

    const { data: claimsData, error: authError } =
      await supabase.auth.getClaims();

    if (authError || !claimsData) {
      return { errorMessage: "You must be signed in to create a listing" };
    }

    const userId = claimsData.claims.sub;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_premium, listing_count_in_window, listing_window_start")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return { errorMessage: "Could not load your account. Please try again." };
    }

    const capCheck = await checkActiveListingCap(
      supabase,
      userId,
      profile.is_premium,
    );

    if (!capCheck.allowed) {
      return { errorMessage: capCheck.errorMessage };
    }

    const limitCheck = checkListingLimit(profile);

    if (!limitCheck.allowed) {
      return { errorMessage: limitCheck.errorMessage };
    }

    // --- Build and validate the listing itself ---
    const title = formData.get("title");
    const description = formData.get("description");
    const price = parseFloat(formData.get("price"));
    const condition = formData.get("condition");
    const category = formData.get("category");
    const location = formData.get("location");
    const imageFiles = formData.getAll("images").filter((f) => f.size > 0);

    if (
      !title ||
      !description ||
      !price ||
      !condition ||
      !category ||
      !location
    ) {
      return { errorMessage: "Please fill in all fields" };
    }

    if (imageFiles.length === 0) {
      return { errorMessage: "Please upload at least one image" };
    }

    const imageUrls = [];
    for (const file of imageFiles) {
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("listing-images")
        .getPublicUrl(filePath);

      imageUrls.push(publicUrlData.publicUrl);
    }

    const { error: insertError } = await supabase.from("listings").insert({
      seller_id: userId,
      title,
      description,
      price,
      condition,
      category,
      location,
      images: imageUrls,
    });

    if (insertError) throw insertError;

    // --- Persist the updated window state, using values from the check ---
    const { error: profileUpdateError } = await supabase
      .from("profiles")
      .update({
        listing_count_in_window: limitCheck.nextCount,
        listing_window_start: limitCheck.nextWindowStart,
      })
      .eq("id", userId);

    if (profileUpdateError) throw profileUpdateError;

    return { errorMessage: null };
  } catch (error) {
    console.error("createListingAction error:", error);
    return { errorMessage: error.message || "Something went wrong" };
  }
}

// export async function createListingAction(formData) {
//   try {
//     const supabase = await createSupabaseClient();
//     const { data: claimsData, error: authError } =
//       await supabase.auth.getClaims();

//     if (authError || !claimsData) {
//       return { errorMessage: "You must be signed in to create a listing" };
//     }

//     const userId = claimsData.claims.sub;
//     const isPremium = claimsData.claims.user_metadata?.isPremium || false;

//     // Get user profile
//     const { data: profile, error: profileError } = await supabase
//       .from("profiles")
//       .select("is_premium, listing_count_in_window, listing_window_start")
//       .eq("id", userId)
//       .single();

//     if (profileError || !profile) {
//       return { errorMessage: "Could not load your account. Please try again." };
//     }

//     // Check for listings per day limit
//     const limit = profile.is_premium
//       ? PREMIUM_LISTINGS_PER_DAY
//       : FREE_LISTINGS_PER_DAY;
//     const windowCheck = checkRollingWindow({
//       windowStart: profile.listing_window_start,
//       currentCount: profile.listing_count_in_window,
//       limit,
//     });

//     if (!windowCheck.allowed) {
//       return {
//         errorMessage: `You've reached your limit of ${limit} listings today. Try again in ${windowCheck.hoursLeft} hour(s)${
//           !profile.is_premium ? ", or upgrade to Premium for 20/day" : ""
//         }.`,
//       };
//     }

//     // Listing limit server-side
//     const { count, error: countError } = await supabase
//       .from("listings")
//       .select("id", { count: "exact", head: true })
//       .eq("seller_id", userId);

//     if (countError) throw countError;

//     if (count >= limit) {
//       return {
//         errorMessage: `You've reached your limit of ${limit} listings.${
//           !isPremium ? " Upgrade to Premium for up to 20." : ""
//         }`,
//       };
//     }

//     const title = formData.get("title");
//     const description = formData.get("description");
//     const price = parseFloat(formData.get("price"));
//     const condition = formData.get("condition");
//     const category = formData.get("category");
//     const location = formData.get("location");
//     const imageFiles = formData.getAll("images"); // multiple files

//     if (
//       !title ||
//       !description ||
//       !price ||
//       !condition ||
//       !category ||
//       !location
//     ) {
//       return { errorMessage: "Please fill in all fields" };
//     }

//     if (!imageFiles.length || imageFiles[0].size === 0) {
//       return { errorMessage: "Please upload at least one image" };
//     }

//     // Upload each image to Storage, collect public URLs
//     const imageUrls = [];
//     for (const file of imageFiles) {
//       if (file.size === 0) continue;

//       const fileExt = file.name.split(".").pop();
//       const filePath = `${userId}/${crypto.randomUUID()}.${fileExt}`;

//       const { error: uploadError } = await supabase.storage
//         .from("listing-images")
//         .upload(filePath, file);

//       if (uploadError) throw uploadError;

//       const { data: publicUrlData } = supabase.storage
//         .from("listing-images")
//         .getPublicUrl(filePath);

//       imageUrls.push(publicUrlData.publicUrl);
//     }

//     const { error: insertError } = await supabase.from("listings").insert({
//       seller_id: userId,
//       title,
//       description,
//       price,
//       condition,
//       category,
//       location,
//       images: imageUrls,
//     });

//     if (insertError) throw insertError;

//     return { errorMessage: null };
//   } catch (error) {
//     console.error("createListingAction error:", error);
//     return { errorMessage: error.message || "Something went wrong" };
//   }
// }

export async function editListingAction(listingId, formData) {
  const supabase = await createSupabaseClient();

  const { data: listing, error: fetchError } = await supabase
    .from("listings")
    .select("last_edited_at, edit_count")
    .eq("id", listingId)
    .single();

  if (fetchError || !listing) {
    return { errorMessage: "Listing not found." };
  }

  const now = new Date();
  const lastEdited = listing.last_edited_at
    ? new Date(listing.last_edited_at)
    : null;
  const isWithin24Hours = lastEdited && now - lastEdited < 24 * 60 * 60 * 1000;

  if (isWithin24Hours && listing.edit_count >= 2) {
    return {
      errorMessage:
        "You have reached the maximum limit of 2 edits per 24 hours for this listing.",
    };
  }

  const newEditCount = isWithin24Hours ? listing.edit_count + 1 : 1;

  const { error: updateError } = await supabase
    .from("listings")
    .update({
      title: formData.get("title"),
      description: formData.get("description"),
      price: parseFloat(formData.get("price")),
      location: formData.get("location"),
      condition: formData.get("condition"),
      category: formData.get("category"),
      edit_count: newEditCount,
      last_edited_at: now.toISOString(),
    })
    .eq("id", listingId);

  if (updateError) {
    return { errorMessage: updateError.message };
  }

  revalidatePath("/account");
  revalidatePath(`/account/itemListing/${listingId}/edit`);

  return { success: true };
}

export async function deleteListingAction(listingId) {
  const supabase = await createSupabaseClient();

  const { error } = await supabase
    .from("listings")
    .delete()
    .eq("id", listingId);

  if (error) {
    return { errorMessage: error.message };
  }

  revalidatePath("/account");
  return { success: true };
}
