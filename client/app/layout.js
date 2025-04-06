"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const hideSideBarRoutes = ["/", "/signin", "/signup"];
  const shouldHideSidebar = hideSideBarRoutes.includes(pathname);
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Toaster position="top-center" />
          {!shouldHideSidebar && <Sidebar />}
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
