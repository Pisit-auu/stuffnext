import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
  currentUser,
  forbidden,
  isAdmin,
  isSuperadmin,
  publicUserSelect,
  unauthorized,
} from "@/lib/authz";

const ROLES = ["user", "admin", "superadmin"] as const;

// ดึงข้อมูล user ตาม username — เจ้าของบัญชี หรือ admin
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const me = await currentUser();
  if (!me) return unauthorized();
  const { id } = await context.params;
  if (me.username !== id && !isAdmin(me)) return forbidden();

  const result = await prisma.user.findUnique({
    where: { username: id },
    select: publicUserSelect,
  });
  if (!result) return NextResponse.json({ message: "ไม่พบผู้ใช้" }, { status: 404 });
  return NextResponse.json(result);
}

// อัปเดตข้อมูล user ตาม username
//  - เจ้าของบัญชี: แก้ข้อมูลตัวเองได้ ต้องยืนยันด้วย currentPassword
//  - admin: แก้ข้อมูลผู้ใช้ทั่วไปได้
//  - superadmin: แก้ได้ทุกคน และเป็นคนเดียวที่เปลี่ยน role ได้
// เปลี่ยนรหัสผ่านใช้ /api/auth/changeps
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const me = await currentUser();
  if (!me) return unauthorized();

  try {
    const { id } = await context.params;
    const body = await request.json();
    const { name, surname, username, email, tel, image, role, currentPassword } = body;

    const target = await prisma.user.findUnique({ where: { username: id } });
    if (!target) return NextResponse.json({ message: "ไม่พบผู้ใช้" }, { status: 404 });

    const isSelf = me.username === target.username;
    if (isSelf) {
      const ok =
        typeof currentPassword === "string" &&
        (await bcrypt.compare(currentPassword, target.password));
      if (!ok) return NextResponse.json({ message: "รหัสผ่านไม่ถูกต้อง" }, { status: 400 });
    } else if (!isSuperadmin(me)) {
      if (!isAdmin(me) || target.role !== "user") return forbidden();
    }

    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (surname) updateData.surname = surname;
    if (username) updateData.username = String(username).trim();
    if (email) updateData.email = email;
    if (tel) updateData.tel = tel;
    if (image) updateData.image = image;

    if (role !== undefined && role !== target.role) {
      if (!isSuperadmin(me)) return forbidden("เฉพาะซูเปอร์แอดมินเท่านั้นที่เปลี่ยนบทบาทได้");
      if (isSelf) return forbidden("เปลี่ยนบทบาทของตัวเองไม่ได้");
      if (!ROLES.includes(role)) {
        return NextResponse.json({ message: "บทบาทไม่ถูกต้อง" }, { status: 400 });
      }
      updateData.role = role;
    }

    if (updateData.username && updateData.username !== target.username) {
      const taken = await prisma.user.findUnique({
        where: { username: updateData.username as string },
      });
      if (taken) return NextResponse.json({ message: "ชื่อผู้ใช้นี้ถูกใช้แล้ว" }, { status: 409 });
    }

    const update = await prisma.user.update({
      where: { username: id },
      data: updateData,
      select: publicUserSelect,
    });
    return NextResponse.json(update);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ลบ user ตาม id — admin ลบผู้ใช้ทั่วไปได้, superadmin ลบได้ทุกคนยกเว้นตัวเอง
export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const me = await currentUser();
  if (!me) return unauthorized();
  if (!isAdmin(me)) return forbidden();

  try {
    const { id } = await context.params;
    const userId = parseInt(id, 10);
    if (isNaN(userId)) return NextResponse.json({ message: "id ไม่ถูกต้อง" }, { status: 400 });
    if (String(userId) === String(me.id)) return forbidden("ลบบัญชีของตัวเองไม่ได้");

    const target = await prisma.user.findUnique({ where: { id: userId } });
    if (!target) return NextResponse.json({ message: "ไม่พบผู้ใช้" }, { status: 404 });
    if (target.role !== "user" && !isSuperadmin(me)) return forbidden();

    const deleted = await prisma.user.delete({
      where: { id: userId },
      select: publicUserSelect,
    });
    return NextResponse.json(deleted);
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
