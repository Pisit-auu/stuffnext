import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavbarGlobal from "./component/navbar/page";
import SessionProvider from "./component/Session/SessionProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route"; // ตรวจสอบ path นี้ให้ถูกต้อง

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stuff Next",
  description: "Stuff Next",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ดึง session โดยส่ง authOptions ไปด้วย
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={`bg-gray-100 ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* ส่ง session ไปยัง SessionProvider */}
        <SessionProvider session={session}>
          <NavbarGlobal /> {/* ตรวจสอบว่า NavbarGlobal ถูกต้องและใช้งานได้ */}
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}