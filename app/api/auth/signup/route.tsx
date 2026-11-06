import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import {
  currentUser,
  forbidden,
  isAdmin,
  isSuperadmin,
  publicUserSelect,
  unauthorized,
} from "@/lib/authz";

const CREATABLE_ROLES = ["user", "admin"] as const;
const MIN_PASSWORD = 6;

// สร้าง user — superadmin เท่านั้น
export async function POST(request: Request) {
  const me = await currentUser();
  if (!me) return unauthorized();
  if (!isSuperadmin(me)) return forbidden("เฉพาะซูเปอร์แอดมินเท่านั้นที่สร้างผู้ใช้ได้");

  try {
    const { username, password, name, surname, role } = await request.json();

    const cleanUsername = typeof username === "string" ? username.trim() : "";
    if (!cleanUsername) {
      return NextResponse.json({ message: "กรอกชื่อผู้ใช้" }, { status: 400 });
    }
    if (typeof password !== "string" || password.length < MIN_PASSWORD) {
      return NextResponse.json(
        { message: `รหัสผ่านต้องยาวอย่างน้อย ${MIN_PASSWORD} ตัวอักษร` },
        { status: 400 }
      );
    }
    const newRole = role ?? "user";
    if (!CREATABLE_ROLES.includes(newRole)) {
      return NextResponse.json({ message: "บทบาทไม่ถูกต้อง" }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({ where: { username: cleanUsername } });
    if (exists) {
      return NextResponse.json({ message: "ชื่อผู้ใช้นี้ถูกใช้แล้ว" }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        username: cleanUsername,
        password: await bcrypt.hash(password, 10),
        name,
        surname,
        role: newRole,
      },
      select: publicUserSelect,
    });

    return NextResponse.json({ message: "User created", user }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "User could not be created" }, { status: 500 });
  }
}

// รายชื่อ user — admin / superadmin
export async function GET(req: NextRequest) {
  const me = await currentUser();
  if (!me) return unauthorized();
  if (!isAdmin(me)) return forbidden();

  const page = req.nextUrl.searchParams.get("page")
    ? parseInt(req.nextUrl.searchParams.get("page")!) : 1;
  const limit = req.nextUrl.searchParams.get("limit")
    ? parseInt(req.nextUrl.searchParams.get("limit")!) : 15;

  if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
    return NextResponse.json({ error: "Invalid page or limit" }, { status: 400 });
  }

  try {
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        skip: (page - 1) * limit,
        take: Math.min(limit, 1000),
        orderBy: { id: "asc" },
        select: publicUserSelect,
      }),
      prisma.user.count(),
    ]);
    return NextResponse.json({ users, totalCount });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
