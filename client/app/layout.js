"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const hideSideBarRoutes = ["/", "/signin", "/signup"];
  const shouldHideSidebar = hideSideBarRoutes.includes(pathname);
  return (
    <html lang="en">
      <body>
        {!shouldHideSidebar && <Sidebar />}
        {children}
      </body>
    </html>
  );
}
