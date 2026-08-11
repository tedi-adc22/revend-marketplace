import TopHeader from "@/components/HomePage/TopHeader";
import CategoriesNavBar from "@/components/HomePage/CategoriesNavBar";
import MainContent from "@/components/HomePage/MainContent";
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
