// app/account/page.jsx
"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MOCK_ITEMS } from "@/lib/MOCK_ITEMS";

// Placeholder until real auth/user data exists
const MOCK_USER = {
  username: "alex_r",
  email: "alex.r@example.com",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
  isPremium: false,
  listingLimit: 5,
};

export default function AccountPage() {
  const [username, setUsername] = useState(MOCK_USER.username);
  const [email, setEmail] = useState(MOCK_USER.email);

  const myListings = MOCK_ITEMS.filter(
    (item) => item.seller.username === MOCK_USER.username,
  );

  const listingLimit = MOCK_USER.isPremium ? 20 : 5;
  const listingsUsed = myListings.length;

  const handleSave = (e) => {
    e.preventDefault();
    // TODO: wire up to Supabase update once auth is in place
    console.log("Saving profile:", { username, email });
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
            <div className="flex items-center gap-4 mb-6">
              <img
                src={MOCK_USER.avatar}
                alt={MOCK_USER.username}
                className="w-16 h-16 rounded-full object-cover border border-gray-200"
              />
              <div>
                <p className="font-semibold text-gray-900">
                  {MOCK_USER.username}
                </p>
                <span
                  className={`inline-block mt-1 px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                    MOCK_USER.isPremium
                      ? "bg-orange-50 text-orange-700 border border-orange-200"
                      : "bg-gray-100 text-gray-600 border border-gray-200"
                  }`}
                >
                  {MOCK_USER.isPremium ? "Premium" : "Free"}
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
                  width: `${Math.min(
                    (listingsUsed / listingLimit) * 100,
                    100,
                  )}%`,
                }}
              />
            </div>
            <p className="text-xs text-gray-500">
              {MOCK_USER.isPremium
                ? "Premium: edit listings once per hour."
                : "Free plan: edit listings twice a day."}
            </p>
            {!MOCK_USER.isPremium && (
              <Button variant="outline" className="w-full">
                Upgrade to Premium
              </Button>
            )}
          </CardContent>
        </Card>

        {/* My Listings Card */}
        <Card>
          <CardHeader>
            <CardTitle>My Listings ({myListings.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {myListings.length === 0 ? (
              <p className="text-sm text-gray-500">
                You haven't posted any listings yet.
              </p>
            ) : (
              <div className="space-y-3">
                {myListings.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 rounded-xl border border-gray-200"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-14 h-14 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        ${item.price} · {item.status}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
