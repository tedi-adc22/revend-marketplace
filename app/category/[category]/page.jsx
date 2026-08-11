import CategoryPage from "@/components/CategoryPageUI/CategoryPage";

export default async function Category({ params }) {
  const { category } = await params;

  return <CategoryPage category={category} />;
}
