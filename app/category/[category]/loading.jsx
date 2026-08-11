import CategoryPage from "@/components/CategoryPageUI/CategoryPage";

export default function Category({ category }) {
  return <CategoryPage className="loading" params={category} />;
}
