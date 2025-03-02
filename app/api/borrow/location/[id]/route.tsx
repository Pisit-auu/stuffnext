import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;  // ใช้ await ที่นี่

    // ดึงข้อมูลจากฐานข้อมูลตาม userId
    const borrowList = await prisma.borrow.findMany({
      where: { borrowLocationId: id },
      include: {
        user: true,
        asset: true,
        borrowLocation: true,
      },
    });

    return NextResponse.json(borrowList, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching borrow history' }, { status: 500 });
  }
}