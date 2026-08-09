import TopHeader from "@/components/layout/1TopHeader";
import CategoriesNavBar from "@/components/layout/2CategoriesNavBar";
import MainContent from "@/components/layout/3MainContent";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <TopHeader />
      <CategoriesNavBar />
      <MainContent />
    </div>
  );
}
