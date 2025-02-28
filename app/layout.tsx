import type { Metadata } from "next";
import { Noto_Sans_Thai, Bai_Jamjuree } from 'next/font/google';
import "./globals.css";
import NavbarGlobal from "./component/navbar/page";
import SessionProvider from "./component/Session/SessionProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Link from 'next/link';

// Fonts
const notoSansThai = Noto_Sans_Thai({
  weight: ['400', '700'],
  subsets: ['thai', 'latin'],
});

const baiJamjuree = Bai_Jamjuree({
  weight: ['400', '700'],
  subsets: ['thai', 'latin'],
});

export const metadata: Metadata = {
  title: "Srinakarin",
  description: "Srinakarin",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get the session by passing authOptions
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${baiJamjuree.className} text-black bg-gray-100 antialiased`}>
        {/* Pass the session to SessionProvider */}
        <SessionProvider session={session}>
          <div className="">
            {/* Hide Slidebar on small screens and show on large screens */}
            <div className="">
              <NavbarGlobal />
            </div>
            <main className="flex-1">
              {children}
              {/* แสดงปุ่ม admin เฉพาะถ้า session มี user และ role เป็น admin */}
              {session?.user?.role === "admin" && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-lg font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition">
                  <Link href="/admin">หน้า Admin</Link>
                </div>
              )}
            </main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}

