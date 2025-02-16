'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function NavbarGlobal() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  // Toggle เมนู
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // ดึงข้อมูลผู้ใช้จาก API
  

  return (
    <div className="relative">
      {/* Navbar */}
      <div className="grid grid-cols-3 bg-sky-600 h-32 items-center shadow-xl z-50 border-b-2 border-blue-950">
        {/* เมนูด้านซ้าย */}
        <div className="flex justify-self-start ml-8">
          <button className="focus:outline-none" onClick={toggleMenu}>
            <img className="w-8 h-8" src="/menu.png" alt="menu" />
          </button>
        </div>

        {/* โลโก้ */}
        <div className="justify-self-center">
          <Link href="/">
            <img className="w-20 h-auto" src="https://res.cloudinary.com/dqod78cp8/image/upload/v1739554101/uploads/qgphknmc83jbkshsshp0.png" alt="Logo" />
          </Link>
        </div>

        {/* เมนูด้านขวา */}
        <div className="flex justify-self-end items-center mr-8 space-x-4">


          <div className="text-white text-xl font-semibold">
            <Link href="/allasset">{"allasset"}</Link>
          </div>
          <div className="text-white text-xl font-semibold">
            <Link href="/admin">{"admin"}</Link>
          </div>

    

        </div>
      </div>

      {/* เมนู Sidebar */}
      {isMenuOpen && (
        <div className="absolute left-0 top-0 w-64 h-[500px] bg-white shadow-lg z-50 rounded-lg overflow-hidden">
          <div className="flex justify-between items-center p-4 bg-sky-600 text-white">
            <div className="text-xl font-semibold">
              <Link href="/">{ "User"}</Link>
            </div>
            <button className="hover:text-red-400" onClick={toggleMenu}>
              ✖
            </button>
          </div>

          <div className="p-4">
          <Link href="/">
              <div className="text-blue-800 mb-4 hover:text-blue-800 cursor-pointer font-medium">
                home
              </div>
            </Link>
            <Link href="/allasset">
              <div className="text-blue-800 mb-4 hover:text-blue-800 cursor-pointer font-medium">
                allasset
              </div>
            </Link>
              <Link href="/admin">
                <div className="text-blue-800 mb-4 hover:text-blue-800 cursor-pointer font-medium">
                  admin
                </div>
              </Link>
          </div>
        </div>
      )}
    </div>
  );
}
