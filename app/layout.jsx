import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import TopHeader from "@/components/HomePage/TopHeader";
import { Toaster } from "react-hot-toast";
import { getUser } from "@/lib/supabase/server";
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const inter = Inter({
  // variable: "--font-Inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Revend",
  description: "Resell site test",
};

export default async function RootLayout({ children }) {
  const user = await getUser();

  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <TopHeader user={user} />
        <main>{children}</main>
        <Toaster toastOptions={{ style: { textAlign: "center" } }} />
      </body>
    </html>
  );
}
