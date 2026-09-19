import TopHeader from "@/components/HomePage/TopHeader";
import CategoriesNavBar from "@/components/HomePage/CategoriesNavBar";
import MainContent from "@/components/HomePage/MainContent";
import Image from "next/image";
import { getUser } from "@/lib/supabase/server";

export default async function Home() {
  return (
    <div>
      {/* <TopHeader /> */}
      <div className="hidden md:block">
        <CategoriesNavBar />
      </div>
      <MainContent />
    </div>
  );
}
