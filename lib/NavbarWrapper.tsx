"use client";

import { usePathname } from "next/navigation";
import NavbarGlobal from "@/app/component/navbar/page";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // กำหนดหน้าที่ต้องการซ่อน Navbar
  const hideNavbarOnPages = ["/login", "/register"];

  if (hideNavbarOnPages.includes(pathname)) return null; // ไม่แสดง Navbar

  return <NavbarGlobal />;
}
