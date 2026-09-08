import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/lib/NavbarWrapper";
import SessionProvider from "./component/Session/SessionProvider";
import { ToastProvider } from "./component/ui/Toast";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const plexThai = IBM_Plex_Sans_Thai({
  weight: ["400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-plex-thai",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ทะเบียนครุภัณฑ์ · Srinakarin",
    template: "%s · ทะเบียนครุภัณฑ์ Srinakarin",
  },
  description:
    "ระบบบริหารจัดการครุภัณฑ์ของโรงเรียนศรีนครินทร์วิทยานุเคราะห์ — รู้ว่าของอยู่ห้องไหน ใครยืมไป และเหลือให้ยืมกี่ชิ้น",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="th" className={`${plexThai.variable} ${plexMono.variable}`}>
      <body className="min-h-screen bg-ground font-sans text-base text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[80] focus:rounded focus:border focus:border-ink focus:bg-plate focus:px-3 focus:py-2 focus:text-base"
        >
          ข้ามไปยังเนื้อหาหลัก
        </a>

        <SessionProvider session={session}>
          <ToastProvider>
            <NavbarWrapper />
            <main id="main" className="min-h-[60vh]">
              {children}
            </main>
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
