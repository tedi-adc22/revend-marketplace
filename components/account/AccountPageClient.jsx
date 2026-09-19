"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, LogOut } from "lucide-react";
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
import { signOutAction } from "@/lib/actions/users";
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

  const handleClickSignOutButton = () => {
    startTransition(async () => {
      const { errorMessage } = await signOutAction();

      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        router.push("/");
        toast.success("Successfully signed out");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-4 sm:space-y-6">
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            My Account
          </h1>
          <button
            onClick={handleClickSignOutButton}
            disabled={isPending}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </>
            )}
          </button>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl">Profile</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-base sm:text-lg shrink-0">
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900 truncate">
                  {username}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  {email}
                </p>
                <span
                  className={`inline-block mt-1 px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold rounded-full ${
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
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl">Plan & Limits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-600">Listings used</span>
              <span className="font-semibold text-gray-900">
                {listingsUsed} / {listingLimit}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full transition-all"
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
              <Button variant="outline" className="w-full text-xs sm:text-sm">
                Upgrade to Premium
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Listings Card */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl">
              My Listings ({listings.length})
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {!isLimitReached && (
              <div
                onClick={() => router.push("/account/itemListing/new")}
                className="flex items-center gap-3 sm:gap-4 p-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center shrink-0 transition-colors">
                  <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-gray-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-xs sm:text-sm text-gray-900">
                    Add New Listing
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    Click to post a new item for sale
                  </p>
                </div>
              </div>
            )}

            {listings.length === 0 ? (
              <p className="text-xs sm:text-sm text-gray-500">
                You haven't posted any listings yet.
              </p>
            ) : (
              <div className="space-y-3">
                {listings.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-gray-200"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={
                          Array.isArray(item.images) && item.images.length > 0
                            ? item.images[0]
                            : "/placeholder.png"
                        }
                        alt={item.title}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-xs sm:text-sm text-gray-900 truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          €{Number(item.price).toFixed(2)} ·{" "}
                          {item.status || "Active"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs flex-1 sm:flex-initial"
                        onClick={() =>
                          router.push(`/account/itemListing/${item.id}/edit`)
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 sm:flex-initial"
                        onClick={() => setListingToDelete(item)}
                      >
                        Delete
                      </Button>
                    </div>
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
        <AlertDialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-lg rounded-2xl">
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
