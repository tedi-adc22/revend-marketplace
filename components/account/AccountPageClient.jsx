"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteListingAction } from "@/lib/actions/listings";
import toast from "react-hot-toast";

export default function AccountPageClient({
  user,
  listings = [],
  isPremium,
  username,
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [listingToDelete, setListingToDelete] = useState(null);

  const email = user.email;

  const listingLimit = isPremium ? 500 : 5;
  const listingsUsed = listings.length;

  const isLimitReached = listingsUsed >= listingLimit;

  const handleDelete = () => {
    if (!listingToDelete) return;

    startTransition(async () => {
      const { errorMessage } = await deleteListingAction(listingToDelete.id);

      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.success(`"${listingToDelete.title}" deleted successfully.`);
      }
      setListingToDelete(null);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">My Account</h1>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold text-lg">
                {username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{username}</p>
                <p className="text-sm text-gray-500">{email}</p>
                <span
                  className={`inline-block mt-1 px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                    isPremium
                      ? "bg-orange-50 text-orange-700 border border-orange-200"
                      : "bg-gray-100 text-gray-600 border border-gray-200"
                  }`}
                >
                  {isPremium ? "Premium" : "Free"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan & Limits Card */}
        <Card>
          <CardHeader>
            <CardTitle>Plan & Limits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Listings used</span>
              <span className="text-sm font-semibold text-gray-900">
                {listingsUsed} / {listingLimit}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full"
                style={{
                  width: `${Math.min((listingsUsed / listingLimit) * 100, 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-gray-500">
              {isPremium
                ? "Premium: edit listings once per hour."
                : "Free plan: edit listings twice a day."}
            </p>
            {!isPremium && (
              <Button variant="outline" className="w-full">
                Upgrade to Premium
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Listings Card */}
        <Card>
          <CardHeader>
            <CardTitle>My Listings ({listings.length})</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {isLimitReached ? (
              ""
            ) : (
              <div
                onClick={() => router.push("/account/itemListing/new")}
                className="flex items-center  gap-4 p-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-lg bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center shrink-0 transition-colors">
                  <Plus className="w-6 h-6 text-gray-600 group-hover:text-gray-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900">
                    Add New Listing
                  </p>
                  <p className="text-xs text-gray-500">
                    Click to post a new item for sale
                  </p>
                </div>
              </div>
            )}

            {listings.length === 0 ? (
              <p className="text-sm text-gray-500">
                You haven't posted any listings yet.
              </p>
            ) : (
              <div className="space-y-3">
                {listings.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 rounded-xl border border-gray-200"
                  >
                    <img
                      src={
                        Array.isArray(item.images) && item.images.length > 0
                          ? item.images[0]
                          : "/placeholder.png"
                      }
                      alt={item.title}
                      className="w-14 h-14 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        €{Number(item.price).toFixed(2)} ·{" "}
                        {item.status || "Active"}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.push(`/account/itemListing/${item.id}/edit`)
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setListingToDelete(item)}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Confirmation Modal */}
      <AlertDialog
        open={!!listingToDelete}
        onOpenChange={(open) => !open && setListingToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete{" "}
              <span className="font-semibold text-gray-900">
                "{listingToDelete?.title}"
              </span>
              . This step cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isPending ? "Deleting..." : "Delete Listing"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
