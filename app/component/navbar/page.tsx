'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession, signOut } from 'next-auth/react';

export default function NavbarGlobal() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const [checksession, setchecksession] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      setchecksession(false);
    } else if (status === 'authenticated') {
      setchecksession(true);
      //console.log(session?.user?.role); // Using optional chaining to avoid errors if session or user is undefined
    }
  }, [status, router]);

  // Toggle menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative">
      {/* Navbar */}
      <div className="grid grid-cols-3 bg-sky-600 h-24 items-center shadow-xl z-50 border-b-2 border-blue-950">
        {/* Left Menu */}
        <div className="flex justify-self-start ml-8">
          <button className="focus:outline-none" onClick={toggleMenu}>
            <img className="w-8 h-8" src="/menu.png" alt="menu" />
          </button>
        </div>

        {/* Logo */}
        <div className="justify-self-center">
          <Link href="/">
            <img className="w-[50px] h-auto" src="https://res.cloudinary.com/dqod78cp8/image/upload/v1739554101/uploads/qgphknmc83jbkshsshp0.png" alt="Logo" />
          </Link>
        </div>

        {/* Right Menu */}
        <div className="flex justify-self-end items-center mr-8 space-x-4 hidden lg:flex">
          <div className="text-white text-xl font-semibold">
            <Link href="/allasset">{"ครุภัณฑ์ทั้งหมด"}</Link>
          </div>
          <div className="text-white text-xl font-semibold">
            <Link href="/">{"สถานที่ทั้งหมด"}</Link>
          </div>

          {checksession && (
            <div className="text-white text-xl font-semibold">
              <Link href="/profile">{"โปรไฟล์"}</Link>
            </div>
          )}

          {checksession && session?.user?.role === "admin" && (
            <div className="text-white text-xl font-semibold">
              <Link href="/admin">{"admin"}</Link>
            </div>
          )}

          {!checksession && (
            <div className="text-white text-xl font-semibold">
              <Link href="/login">{"เข้าสู่ระบบ"}</Link>
            </div>
          )}

          {checksession && (
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-white text-xl font-semibold"
            >
              ออกจากระบบ
            </button>
          )}
        </div>
      </div>

      {/* Sidebar Menu */}
      {isMenuOpen && (
        <div className="absolute left-0 top-0 w-64 h-[500px] bg-white shadow-lg z-50 rounded-lg overflow-hidden">
          <div className="flex justify-between items-center p-4 bg-sky-600 text-white">
            <div className="text-xl font-semibold">
              <Link href="/profile">{session?.user?.name}</Link>
            </div>
            <button className="hover:text-red-400" onClick={toggleMenu}>
              ✖
            </button>
          </div>

          <div className="p-4">
            <Link href="/allasset">
              <div className="text-blue-800 mb-4 hover:text-blue-800 cursor-pointer font-medium">
                ครุภัณฑ์ทั้งหมด
              </div>
            </Link>
            <Link href="/">
              <div className="text-blue-800 mb-4 hover:text-blue-800 cursor-pointer font-medium">
                สถานที่ทั้งหมด
              </div>
            </Link>
            {checksession && (
              <Link href="/profile">
                <div className="text-blue-800 mb-4 hover:text-blue-800 cursor-pointer font-medium">
                  โปรไฟล์
                </div>
              </Link>
            )}
            {checksession && (
              <Link href="/profile/history">
                <div className="text-blue-800 mb-4 hover:text-blue-800 cursor-pointer font-medium">
                  ประวัติการยืม
                </div>
              </Link>
            )}
            {!checksession && (
              <Link href="/login">
                <div className="text-blue-800 mb-4 hover:text-blue-800 cursor-pointer font-medium">
                  login
                </div>
              </Link>
            )}
            {checksession && session?.user?.role === "admin" && (
              <Link href="/admin">
                <div className="text-blue-800 mb-4 hover:text-blue-800 cursor-pointer font-medium">
                  admin
                </div>
              </Link>
            )}
            {checksession && session?.user?.role === "admin" && (
              <Link href="/admin/borrowall">
                <div className="text-blue-800 mb-4 hover:text-blue-800 cursor-pointer font-medium">
                  ประวัติการยืมทั้งหมด
                </div>
              </Link>
            )}
            {checksession && session?.user?.role === "admin" && (
              <Link href="/admin/user">
                <div className="text-blue-800 mb-4 hover:text-blue-800 cursor-pointer font-medium">
                  user ทั้งหมด
                </div>
              </Link>
            )}
            {checksession && (
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-red-800  font-medium"
            >
              ออกจากระบบ
            </button>
          )}
          </div>
        </div>
      )}
    </div>
  );
}
