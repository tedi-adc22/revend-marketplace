import TopHeader from "@/components/HomePage/1TopHeader";
import CategoriesNavBar from "@/components/HomePage/2CategoriesNavBar";
import MainContent from "@/components/HomePage/3MainContent";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      {/* <TopHeader /> */}
      <CategoriesNavBar />
      <MainContent />
    </div>
  );
}
