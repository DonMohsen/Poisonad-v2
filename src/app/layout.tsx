import type { Metadata } from "next";
import { Geist, Geist_Mono, Vazirmatn } from "next/font/google";
import "./globals.css";
import MobileFooter from "@/components/MobileFooter";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const vazirMatn = Vazirmatn({
  variable: "--font-vazir-matn",
  subsets: ["latin", "arabic"], // You can specify 'latin' and 'arabic' subsets if you need
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Sbad",
  description: "سامانه بی‌مدیریتی امور دانشجویی",
  icons: {
    icon: "/favicon.ico", // default favicon
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest", // for PWA / Android
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${vazirMatn.className} antialiased  `}
      >
 {/* Toaster must go here */}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                zIndex: 9999,
                background: "#333",
                color: "#fff",
              },
            }}
          />

          {/* Desktop View */}
          <div className="hidden lg:flex h-screen overflow-hidden bg-[#f2f0fd] dark:bg-black">
            <div className="w-64 fixed h-screen p-4">
              <Sidebar />
            </div>

            <div
              className={`flex-1 ml-[100px] flex items-center justify-center  p-4`}
            >
              <div className="rounded-2xl dark:bg-black w-full h-full overflow-hidden flex flex-col shadow-md ">
                <div className="flex-1 overflow-y-auto dark:bg-black">
                  <div className="sticky top-0 rounded-2xl z-50">
                    <Header />
                  </div>
                  <div className="">{children}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile View */}
          <div className="lg:hidden">
            <Header />
            {children}
          </div>

          <MobileFooter />
      </body>
    </html>
  );
}
