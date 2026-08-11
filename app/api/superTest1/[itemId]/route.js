import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { itemId } = await params;
  console.log("API HIT — itemId:", itemId);

  const testItemListing = {
    id: itemId,
    title:
      'Dell Latitude 5520 15.6" Full HD Laptop (Intel Core i7-1185G7, 16GB RAM, 512GB SSD)',
    dateListed: "Posted 2 days ago",
    location: "Austin, TX",
    price: "$520.00",
    condition: "Like New (Refurbished)",
    inCarts: "In 12 carts",
    seller: {
      name: "Alex Rivera",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      rating: "4.9 ★",
      salesCount: "48 sales",
      responseRate: "Replies within 1 hour",
    },
    description: `Dell Latitude 5520 in excellent working condition. Barely used for a few months in an office environment. 

Key Specifications:
- Processor: 11th Gen Intel Core i7-1185G7 @ 3.00GHz
- Memory: 16 GB DDR4 RAM
- Storage: 512 GB PCIe NVMe M.2 SSD
- Display: 15.6" FHD (1920 x 1080) Anti-glare
- Operating System: Windows 11 Pro installed & activated

Includes original Dell USB-C charger. Battery health is listed as "Excellent" in BIOS. Fully tested, wiped, and ready for a new home. Free local pickup in Austin, TX, or fast tracked shipping.`,
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80",
    ],
  };

  const TEST_ITEM = [
    {
      id: "1",
      title: "DJI Osmo Action 5 Pro Essential Combo",
      price: 349.0,
      condition: "Like New",
      location: "Austin, TX",
      description:
        "Barely used DJI Osmo Action 5 Pro. Comes with extra battery, protective frame, and original box. Perfect for vloggers and sports recording.",
      images: [
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop",
      ],
      status: "available",
      category: "electronics",
      createdAt: "2024-06-15T10:00:00Z",
      lastEditedAt: "2024-06-15T10:00:00Z",
      viewCount: 128,
      seller: {
        id: "user_123",
        username: "alex_r",
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
        isPremium: true,
      },
    },
  ];

  return NextResponse.json(itemId === "1" ? TEST_ITEM[0] : testItemListing);
}
