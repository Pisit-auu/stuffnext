import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; 


export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params; // ใช้ await กับ params ก่อนการใช้งาน

    // ดึงข้อมูลจากฐานข้อมูลตาม userId
    const borrowList = await prisma.borrow.findMany({
      where: { userId: Number(id) },
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