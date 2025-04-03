"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import { usePathname } from "next/navigation";


export default function RootLayout({ children }) {
  const pathname = usePathname();
  return (
    <html lang="en">
      <body>
        {pathname != "/" && <Sidebar />}
        {children}
      </body>
    </html>
  );
}
