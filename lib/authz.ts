import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";

export type SessionUser = { id: string; username?: string; role?: string };

/** คืน user ที่ login อยู่ หรือ null */
export async function currentUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  return (session?.user as SessionUser | undefined) ?? null;
}

export const isAdmin = (u: SessionUser | null) =>
  u?.role === "admin" || u?.role === "superadmin";
export const isSuperadmin = (u: SessionUser | null) => u?.role === "superadmin";

export const unauthorized = () =>
  NextResponse.json({ message: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
export const forbidden = (msg = "ไม่มีสิทธิ์ทำรายการนี้") =>
  NextResponse.json({ message: msg }, { status: 403 });

/** ฟิลด์ user ที่ส่งออก API ได้ (ไม่มี password) */
export const publicUserSelect = {
  id: true,
  name: true,
  surname: true,
  username: true,
  email: true,
  tel: true,
  image: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const;
