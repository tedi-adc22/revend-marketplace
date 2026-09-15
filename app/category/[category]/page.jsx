import CategoryPage from "@/components/CategoryPageUI/CategoryPage";
import { getFilteredListings } from "@/lib/actions/data";
import { CATEGORIES } from "@/lib/constants/categories";

export async function generateMetadata({ params }) {
  const { category } = await params;
  const label = CATEGORIES.find((c) => c.value === category)?.label || category;

  return {
    title: `${label} | Revend`,
    description: `Browse ${label} listings for sale on Revend.`,
  };
}

export default async function Category({ params, searchParams }) {
  const { category } = await params;
  const sParams = await searchParams;

  const currentPage = Math.max(1, parseInt(sParams.page || "1", 10));

  const { listings, count, totalPages, maxDatabasePrice, error } =
    await getFilteredListings({
      baseFilterFn: (q) => q.eq("category", category),
      page: currentPage,
      minPrice: sParams.minPrice ? Number(sParams.minPrice) : null,
      maxPrice: sParams.maxPrice ? Number(sParams.maxPrice) : null,
      condition: sParams.condition !== "All" ? sParams.condition : null,
      sort: sParams.sort || "Newest",
    });

  if (error) console.error("Error fetching category listings:", error.message);

  return (
    <CategoryPage
      category={category}
      initialListings={listings}
      currentPage={currentPage}
      totalPages={totalPages}
      totalResults={count}
      maxPrice={maxDatabasePrice}
    />
  );
}
