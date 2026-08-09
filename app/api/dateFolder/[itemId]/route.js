import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  // Await params in Next.js App Router
  const { itemId } = await params;

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

  return NextResponse.json(testItemListing);
}
