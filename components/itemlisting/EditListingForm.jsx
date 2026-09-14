"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { editListingAction } from "@/lib/actions/listings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Upload, X, Loader2, MapPin, Euro } from "lucide-react";

const CATEGORIES = [
  { label: "Electronics", value: "electronics" },
  { label: "Vehicles", value: "vehicles" },
  { label: "Real Estate", value: "real-estate" },
  { label: "Apparel & Accessories", value: "apparel-and-accessories" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Hobbies", value: "hobbies" },
  { label: "Industrial Equipment", value: "industrial-equipment" },
  { label: "Home & Garden", value: "home-and-garden" },
];

const CONDITIONS = ["New", "Like New", "Good", "Ok", "Poor"];

const MAX_IMAGES = 3;
const MAX_WORDS = 300;
const MAX_PRICE = 5000000;

export default function EditListingForm({ initialListing }) {
  const [isPending, startTransition] = useTransition();
  const [description, setDescription] = useState(
    initialListing.description || "",
  );
  const [existingImages, setExistingImages] = useState(
    initialListing.images || [],
  );
  const [newImages, setNewImages] = useState([]);
  const router = useRouter();

  const totalImageCount = existingImages.length + newImages.length;
  const wordCount = description.length;

  // Handle Description Change
  const handleDescriptionChange = (e) => {
    const text = e.target.value;
    if (text.length <= MAX_WORDS || text.length < description.length) {
      setDescription(text);
    } else {
      toast.error(`Maximum limit of ${MAX_WORDS} characters reached!`, {
        id: "word-limit",
      });
    }
  };

  // Handle New Image Uploads
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (totalImageCount + files.length > MAX_IMAGES) {
      toast.error(`You can only upload up to ${MAX_IMAGES} images.`);
      return;
    }

    const newPreviews = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setNewImages((prev) => [...prev, ...newPreviews]);
  };

  // Remove existing image (from database storage)
  const removeExistingImage = (indexToRemove) => {
    setExistingImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Remove newly selected image file
  const removeNewImage = (indexToRemove) => {
    setNewImages((prev) => {
      const updated = prev.filter((_, index) => index !== indexToRemove);
      URL.revokeObjectURL(prev[indexToRemove].previewUrl);
      return updated;
    });
  };

  const handleSubmitEditListing = (e) => {
    e.preventDefault();

    if (totalImageCount === 0) {
      toast.error("Please provide at least one image.");
      return;
    }

    const formData = new FormData(e.currentTarget);

    console.log("FORM DATA---------", formData);
    // Pass existing image URLs retained by user
    formData.append("existingImages", JSON.stringify(existingImages));

    // Append newly selected image files
    formData.delete("images");
    newImages.forEach((imgObj) => {
      formData.append("images", imgObj.file);
    });

    startTransition(async () => {
      const { errorMessage } = await editListingAction(
        initialListing.id,
        formData,
      );

      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.success("Listing updated successfully!");
        router.push("/account");
      }
    });
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-sm border-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Edit Listing</CardTitle>
        <CardDescription>
          Update details, price, or photos for your item.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmitEditListing} className="space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={initialListing.title}
              required
              disabled={isPending}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <div className="relative">
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={handleDescriptionChange}
                required
                disabled={isPending}
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 pb-7 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y break-words"
              />
              <div
                className={`absolute bottom-2 right-3 text-xs font-medium pointer-events-none transition-colors ${
                  wordCount >= MAX_WORDS
                    ? "text-red-500 font-bold"
                    : "text-muted-foreground"
                }`}
              >
                {wordCount} / {MAX_WORDS} Characters
              </div>
            </div>
          </div>

          {/* Price and Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Price (€) */}
            <div className="space-y-2">
              <Label htmlFor="price">Price (€)</Label>
              <div className="relative flex items-center">
                <Euro className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={initialListing.price}
                  className="pl-9"
                  required
                  disabled={isPending}
                  onInput={(e) => {
                    if (Number(e.target.value) > MAX_PRICE) {
                      e.target.value = MAX_PRICE.toString();
                      toast.error("Maximum allowed price is 5,000,000 €", {
                        id: "max-price",
                      });
                    }
                  }}
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative flex items-center">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="location"
                  name="location"
                  defaultValue={initialListing.location}
                  className="pl-9"
                  required
                  disabled={isPending}
                />
              </div>
            </div>
          </div>

          {/* Condition and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <select
                id="condition"
                name="condition"
                defaultValue={initialListing.condition}
                required
                disabled={isPending}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                defaultValue={initialListing.category}
                required
                disabled={isPending}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Dropzone & Combined Previews */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Item Images</Label>
              <span className="text-xs text-muted-foreground font-medium">
                {totalImageCount} / {MAX_IMAGES} uploaded
              </span>
            </div>

            {totalImageCount < MAX_IMAGES && (
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50/50 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  disabled={isPending || totalImageCount >= MAX_IMAGES}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <div className="text-sm">
                    <span className="font-semibold text-primary">
                      Click to upload
                    </span>{" "}
                    (Max {MAX_IMAGES} photos)
                  </div>
                </div>
              </div>
            )}

            {/* Combined Image Previews (Existing + New Files) */}
            {totalImageCount > 0 && (
              <div className="grid grid-cols-3 gap-3 pt-2">
                {/* Existing Storage Images */}
                {existingImages.map((url, idx) => (
                  <div
                    key={`existing-${idx}`}
                    className="relative aspect-square rounded-md overflow-hidden border group"
                  >
                    <img
                      src={url}
                      alt={`Existing ${idx + 1}`}
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(idx)}
                      className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white p-1 rounded-full transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                {/* Newly Added File Previews */}
                {newImages.map((img, idx) => (
                  <div
                    key={`new-${idx}`}
                    className="relative aspect-square rounded-md overflow-hidden border group"
                  >
                    <img
                      src={img.previewUrl}
                      alt={`New preview ${idx + 1}`}
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(idx)}
                      className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white p-1 rounded-full transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              className="w-1/2 h-11"
              onClick={() => router.push("/account")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || totalImageCount === 0}
              className="w-1/2 h-11"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
