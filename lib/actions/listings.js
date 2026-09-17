"use server";

import { createSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  FREE_LISTINGS_PER_DAY,
  PREMIUM_LISTINGS_PER_DAY,
  FREE_LISTING_CAP,
  PREMIUM_LISTING_CAP,
  MAX_IMAGE_SIZE_BYTES,
  MAX_CHARACTERS_DESCRIPTION,
  MAX_TITLE_LENGTH,
  MAX_LOCATION_LENGTH,
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGES,
  MAX_PRICE,
} from "../constants/limits";
import { CONDITIONS } from "../constants/conditions";
import { CATEGORIES } from "../constants/categories";

const WINDOW_HOURS = 24;

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

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { errorMessage: "You must be signed in to create a listing." };
    }
    const userId = user.id;

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

    // --- Parse form fields ---
    const title = formData.get("title");
    const description = formData.get("description");
    const priceRaw = formData.get("price");
    const price = parseFloat(priceRaw);
    const condition = formData.get("condition");
    const category = formData.get("category");
    const location = formData.get("location");
    const imageFiles = formData.getAll("images").filter((f) => f.size > 0);

    // Check empty fields
    if (
      !title ||
      !description ||
      !priceRaw ||
      !condition ||
      !category ||
      !location
    ) {
      return { errorMessage: "Please fill in all fields." };
    }

    if (isNaN(price) || price <= 0) {
      return { errorMessage: "Please enter a valid positive price." };
    }

    if (price > MAX_PRICE) {
      return { errorMessage: `Price cannot exceed ${MAX_PRICE}.` };
    }

    if (!CONDITIONS.includes(condition)) {
      return { errorMessage: "Invalid condition selected." };
    }

    const validCategoryValues = CATEGORIES.map((c) => c.value);
    if (!validCategoryValues.includes(category)) {
      return { errorMessage: "Invalid category selected." };
    }

    // Length limit checks
    if (title.length > MAX_TITLE_LENGTH) {
      return {
        errorMessage: `Title must be ${MAX_TITLE_LENGTH} characters or fewer.`,
      };
    }

    if (location.length > MAX_LOCATION_LENGTH) {
      return {
        errorMessage: `Location must be ${MAX_LOCATION_LENGTH} characters or fewer.`,
      };
    }

    if (description.length > MAX_CHARACTERS_DESCRIPTION) {
      return {
        errorMessage: `Description must be ${MAX_CHARACTERS_DESCRIPTION} characters or fewer.`,
      };
    }

    // Image checks

    if (imageFiles.length > MAX_IMAGES) {
      return { errorMessage: `You can upload at most ${MAX_IMAGES} images.` };
    }

    if (imageFiles.length === 0) {
      return { errorMessage: "Please upload at least one image." };
    }

    const oversizedFile = imageFiles.find((f) => f.size > MAX_IMAGE_SIZE_BYTES);
    if (oversizedFile) {
      return {
        errorMessage: `An image exceeds the ${MAX_IMAGE_SIZE_BYTES / (1024 * 1024)}MB size limit.`,
      };
    }

    const invalidTypeFile = imageFiles.find(
      (f) => !ALLOWED_IMAGE_TYPES.includes(f.type),
    );
    if (invalidTypeFile) {
      return { errorMessage: "Only JPEG, PNG, and WEBP images are allowed." };
    }

    // Process uploads
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

    if (insertError) {
      if (insertError.message?.includes("LISTING_CAP_EXCEEDED")) {
        return {
          errorMessage: `You can only have ${profile.is_premium ? 20 : 5} listings at a time.`,
        };
      }
      throw insertError;
    }

    // Persist window state
    const { error: profileUpdateError } = await supabase
      .from("profiles")
      .update({
        listing_count_in_window: limitCheck.nextCount,
        listing_window_start: limitCheck.nextWindowStart,
      })
      .eq("id", userId);

    if (profileUpdateError) throw profileUpdateError;

    // Invalidate cache so newly created items render on profile
    revalidatePath("/");
    revalidatePath("/account");
    revalidatePath(`/category/${category}`);

    return { errorMessage: null };
  } catch (error) {
    console.error("createListingAction error:", error);
    return {
      errorMessage:
        "Failed to create listing. Please check your inputs and try again.",
    };
  }
}

export async function editListingAction(listingId, formData) {
  try {
    const supabase = await createSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { errorMessage: "You must be signed in to delete a listing." };
    }
    const userId = user.id;

    const { data: listing, error: fetchError } = await supabase
      .from("listings")
      .select("last_edited_at, edit_count, seller_id, images")
      .eq("id", listingId)
      .single();

    if (fetchError || !listing || listing.seller_id !== userId) {
      return { errorMessage: "Listing not found or access denied." };
    }

    // Edit rate limit
    const now = new Date();
    const lastEdited = listing.last_edited_at
      ? new Date(listing.last_edited_at)
      : null;
    const isWithin24Hours =
      lastEdited && now - lastEdited < 24 * 60 * 60 * 1000;

    if (isWithin24Hours && listing.edit_count >= 2) {
      return {
        errorMessage:
          "You have reached the maximum limit of 2 edits per 24 hours for this listing.",
      };
    }

    const newEditCount = isWithin24Hours ? listing.edit_count + 1 : 1;

    const title = formData.get("title");
    const description = formData.get("description");
    const priceRaw = formData.get("price");
    const price = parseFloat(priceRaw);
    const location = formData.get("location");
    const condition = formData.get("condition");
    const category = formData.get("category");
    const existingImagesRaw = formData.get("existingImages");
    let requestedImages = [];
    const newFiles = formData.getAll("images").filter((f) => f.size > 0);

    try {
      requestedImages = existingImagesRaw ? JSON.parse(existingImagesRaw) : [];
    } catch {
      requestedImages = [];
    }

    const actualImages = Array.isArray(listing.images) ? listing.images : [];
    const retainedImages = Array.isArray(requestedImages)
      ? requestedImages.filter((url) => actualImages.includes(url))
      : [];

    if (
      !title ||
      !description ||
      !priceRaw ||
      !location ||
      !condition ||
      !category
    ) {
      return { errorMessage: "Please fill in all fields." };
    }

    if (isNaN(price) || price <= 0) {
      return { errorMessage: "Please enter a valid positive price." };
    }

    if (title.length > MAX_TITLE_LENGTH) {
      return {
        errorMessage: `Title must be ${MAX_TITLE_LENGTH} characters or fewer.`,
      };
    }

    if (location.length > MAX_LOCATION_LENGTH) {
      return {
        errorMessage: `Location must be ${MAX_LOCATION_LENGTH} characters or fewer.`,
      };
    }

    if (description.length > MAX_CHARACTERS_DESCRIPTION) {
      return {
        errorMessage: `Description must be ${MAX_CHARACTERS_DESCRIPTION} characters or fewer.`,
      };
    }

    // Validate file sizes on newly added files
    const oversizedFile = newFiles.find((f) => f.size > MAX_IMAGE_SIZE_BYTES);
    if (oversizedFile) {
      return {
        errorMessage: `An image exceeds the ${MAX_IMAGE_SIZE_BYTES / (1024 * 1024)}MB size limit.`,
      };
    }

    if (retainedImages.length + newFiles.length > MAX_IMAGES) {
      return {
        errorMessage: `You can have at most ${MAX_IMAGES} images total.`,
      };
    }

    const invalidTypeFile = newFiles.find(
      (f) => !ALLOWED_IMAGE_TYPES.includes(f.type),
    );
    if (invalidTypeFile) {
      return { errorMessage: "Only JPEG, PNG, and WEBP images are allowed." };
    }

    const uploadedUrls = [];
    for (const file of newFiles) {
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("listing-images")
        .getPublicUrl(filePath);

      uploadedUrls.push(publicUrlData.publicUrl);
    }

    const finalImages = [...retainedImages, ...uploadedUrls];

    if (finalImages.length === 0) {
      return { errorMessage: "Please keep or upload at least one image." };
    }

    // Atomic ownership validation on update
    const { error: updateError } = await supabase
      .from("listings")
      .update({
        title,
        description,
        price,
        location,
        condition,
        category,
        images: finalImages,
        edit_count: newEditCount,
        last_edited_at: now.toISOString(),
      })
      .eq("id", listingId)
      .eq("seller_id", userId);

    if (updateError) {
      return { errorMessage: updateError.message };
    }

    revalidatePath("/");
    revalidatePath("/account");
    revalidatePath(`/item/${listingId}`);
    revalidatePath(`/account/itemListing/${listingId}/edit`);

    return { success: true };
  } catch (error) {
    console.error("editListingAction error:", error);
    return {
      errorMessage:
        "Failed to edit listing. Please check your inputs and try again.",
    };
  }
}

function getStoragePathFromUrl(url, bucketName = "listing-images") {
  try {
    const urlObj = new URL(url);
    // Decode URI component to handle encoded characters cleanly
    const decodedPath = decodeURIComponent(urlObj.pathname);
    const prefix = `/storage/v1/object/public/${bucketName}/`;

    if (decodedPath.includes(prefix)) {
      return decodedPath.split(prefix)[1];
    }

    // Fallback if public URL structure varies
    const segments = decodedPath.split(`${bucketName}/`);
    return segments.length > 1
      ? segments.slice(1).join(`${bucketName}/`)
      : null;
  } catch (error) {
    console.error("Invalid image URL:", url);
    return null;
  }
}

export async function deleteListingAction(listingId) {
  try {
    const supabase = await createSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { errorMessage: "You must be signed in to create a listing." };
    }
    const userId = user.id;

    const { data: listing, error: fetchError } = await supabase
      .from("listings")
      .select("seller_id, images")
      .eq("id", listingId)
      .single();

    if (fetchError || !listing) {
      return { errorMessage: "Listing not found." };
    }

    // Server side check, there is another RLS check on supabase
    if (listing.seller_id !== userId) {
      return {
        errorMessage: "You don't have permission to delete this listing.",
      };
    }

    //  Delete associated images from Supabase Storage
    if (Array.isArray(listing.images) && listing.images.length > 0) {
      const pathsToDelete = listing.images
        .map((url) => getStoragePathFromUrl(url, "listing-images"))
        .filter(Boolean);

      if (pathsToDelete.length > 0) {
        const { error: storageError } = await supabase.storage
          .from("listing-images")
          .remove(pathsToDelete);

        if (storageError) {
          console.error(
            "Failed to delete listing images from storage:",
            storageError,
          );
        }
      }
    }

    // Atomic ownership validation on delete
    const { error: deleteError } = await supabase
      .from("listings")
      .delete()
      .eq("id", listingId)
      .eq("seller_id", userId);

    if (deleteError) {
      return { errorMessage: "Failed to delete listing. Please try again." };
    }

    revalidatePath("/");
    revalidatePath("/account");
    return { errorMessage: null };
  } catch (error) {
    console.error("deleteListingAction error:", error);
    return {
      errorMessage:
        "Failed to delete listing. Please check your inputs and try again.",
    };
  }
}
