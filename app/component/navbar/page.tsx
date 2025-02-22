'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession, signOut } from 'next-auth/react'

export default function NavbarGlobal() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession()
  const [checksession ,setchecksession ] = useState(false)
  const [username , setusername] = useState('')

  const router = useRouter()


  
  useEffect(() => {
    if (status === 'unauthenticated') {
      setchecksession(false)
      
    }else if(status === 'authenticated'){
      setchecksession(true)
      console.log(session.user.role)
    }
  }, [status, router])

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
            <Link href="/allasset">{"ครุภัณฑ์ทั้งหมด"}</Link>
          </div>
          <div className="text-white text-xl font-semibold">
            <Link href="/">{"สถานที่ทั้งหมด"}</Link>
          </div>
    
                {checksession === true &&(
                    <div className="text-white text-xl font-semibold">
                    <Link href="/profile">{"โปรไฟล์"}</Link>
                  </div>
              
               )}
             {checksession === true && session?.user.role === "admin" && (
              <div className="text-white text-xl font-semibold">
                <Link href="/admin">{"admin"}</Link>
              </div>
            )}
            {checksession === false &&  (
              <div className="text-white text-xl font-semibold">
              <Link href="/login">{"เข้าสู่ระบบ"}</Link>
            </div>
             )}
          {checksession === true &&(
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="text-white text-xl font-semibold"
              >
                ออกจากระบบ
             
              </button>
              
               )}

        </div>
      </div>

      {/* เมนู Sidebar */}
      {isMenuOpen && (
        <div className="absolute left-0 top-0 w-64 h-[500px] bg-white shadow-lg z-50 rounded-lg overflow-hidden">
          <div className="flex justify-between items-center p-4 bg-sky-600 text-white">
            <div className="text-xl font-semibold">
              <Link href="/profile">{ session?.user?.name}</Link>
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
            {checksession === true &&(
                <Link href="/profile">
                <div className="text-blue-800 mb-4 hover:text-blue-800 cursor-pointer font-medium">
                โปรไฟล์
                </div>
              </Link>
             )}
             {checksession === true &&(
                <Link href="/profile/history">
                <div className="text-blue-800 mb-4 hover:text-blue-800 cursor-pointer font-medium">
              ประวัติการยืม
                </div>
              </Link>
             )}
             {checksession === false &&(
                <Link href="/login">
                <div className="text-blue-800 mb-4 hover:text-blue-800 cursor-pointer font-medium">
                login
                </div>
              </Link>
             )}
             {checksession === true && session.user.role === "admin" &&(
                <Link href="/admin">
                <div className="text-blue-800 mb-4 hover:text-blue-800 cursor-pointer font-medium">
                admin
                </div>
              </Link>
              
             )}
             {checksession === true && session.user.role === "admin" &&(
                <Link href="/admin/borrowall">
                <div className="text-blue-800 mb-4 hover:text-blue-800 cursor-pointer font-medium">
                ประวัติการยืมทั้งหมด
                </div>
              </Link>
              
             )}
          </div>
        </div>
      )}
    </div>
  );
}
