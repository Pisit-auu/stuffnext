'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession, signOut } from 'next-auth/react';

export default function NavbarGlobal() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const [checksession, setchecksession] = useState(false);
  const [name, setName] = useState<string>(''); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      setchecksession(false);
    } else if (status === 'authenticated') {
      setchecksession(true);
      setName(session?.user?.name || '');
    }
  }, [status, router]);

  return (
    <div className="relative">
      {/* Navbar */}
      <div className="flex items-center justify-between bg-[#7EDBE9] h-20 px-6 shadow-lg border-b-2 border-blue-950">
        
        {/* ปุ่มเมนู (Sidebar) สำหรับมือถือ */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden">
          <img className="w-8 h-8" src="/menu.png" alt="menu" />
        </button>

        {/* โลโก้หรือชื่อระบบ */}
        <Link href="/">
          <h1 className="text-xl text-[#002584] font-semibold">┃Srinakarin Inventory</h1>
        </Link>

        {/* เมนูหลัก (ซ่อนในมือถือ) */}
        <div className="hidden lg:flex items-center space-x-6">
          <Link href="/allasset" className="text-black text-lg font-semibold">ครุภัณฑ์ทั้งหมด</Link>
          <Link href="/" className="text-black text-lg font-semibold">สถานที่ทั้งหมด</Link>
          {checksession && (
            <Link href="/profile/history" className="text-black text-lg font-semibold">สถานะรายการ</Link>
          )}
          {!checksession ? (
            <Link href="/login" className="text-black text-lg font-semibold">เข้าสู่ระบบ</Link>
          ) : (
            <div className="relative">
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="text-black text-lg  font-semibold">
                {name} ﹀
              </button>
              {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                      {session?.user.role === 'admin' && (
                        <>
                          <Link href="/admin">
                            <button className="w-full text-left px-4 py-2 text-black hover:bg-gray-200">
                              Admin
                            </button>
                          </Link>
                          <Link href="/admin/borrowall">
                            <button className="w-full text-left px-4 py-2 text-black hover:bg-gray-200">
                              All History
                            </button>
                          </Link>
                          <Link href="/admin/user">
                            <button className="w-full text-left px-4 py-2 text-black hover:bg-gray-200">
                              All User
                            </button>
                          </Link>
                        </>
                      )}

                      <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="w-full text-left px-4 py-2 text-black hover:bg-gray-200"
                      >
                        ออกจากระบบ
                      </button>
                    </div>
                  )}

            </div>
          )}

          {checksession && (
            <Link href="/profile">
              <img className="w-10 h-10 rounded-full" src="/profile.png" alt="Profile" />
            </Link>
          )}
        </div>
      </div>

      {/* Sidebar (สำหรับมือถือ) */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out z-50`}>
        
        {/* หัวเมนู Sidebar */}
        <div className="flex justify-between items-center p-4 bg-[#7EDBE9] text-white">
          <h1 className="text-xl font-semibold">{session?.user?.name || "เมนู"}</h1>
          <button onClick={() => setIsMenuOpen(false)} className="hover:text-red-400">✖</button>
        </div>

        {/* รายการเมนู */}
        <div className="p-4 space-y-4">
          <Link href="/allasset" className="block text-blue-800 hover:text-blue-600 font-medium">ครุภัณฑ์ทั้งหมด</Link>
          <Link href="/" className="block text-blue-800 hover:text-blue-600 font-medium">สถานที่ทั้งหมด</Link>

          {checksession && (
            <>
              <Link href="/profile" className="block text-blue-800 hover:text-blue-600 font-medium">โปรไฟล์</Link>
              <Link href="/profile/history" className="block text-blue-800 hover:text-blue-600 font-medium">ประวัติการยืม</Link>
            </>
          )}

          {!checksession ? (
            <Link href="/login" className="block text-blue-800 hover:text-blue-600 font-medium">เข้าสู่ระบบ</Link>
          ) : (
            <>
              {session?.user?.role === "admin" && (
                <>
                  <Link href="/admin" className="block text-blue-800 hover:text-blue-600 font-medium">หน้า Admin</Link>
                  <Link href="/admin/borrowall" className="block text-blue-800 hover:text-blue-600 font-medium">ประวัติการยืมทั้งหมด</Link>
                  <Link href="/admin/user" className="block text-blue-800 hover:text-blue-600 font-medium">ผู้ใช้ทั้งหมด</Link>
                </>
              )}
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="w-full text-left text-red-800 font-medium hover:text-red-600"
              >
                ออกจากระบบ
              </button>
            </>
          )}
        </div>
      </div>

      {/* ปิดเมนูเมื่อกดข้างนอก */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black opacity-30 z-40" onClick={() => setIsMenuOpen(false)}></div>
      )}
    </div>
  );
}
