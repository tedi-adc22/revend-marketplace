"use client";

import { useEffect } from "react";

export default function ViewTracker({ itemId }) {
  useEffect(() => {
    // Only fire view count after component mounts on client side
    fetch(`/api/listings/${itemId}/view`, {
      method: "POST",
    }).catch(() => {});
  }, [itemId]);

  return null;
}
