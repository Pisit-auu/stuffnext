import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;  // ใช้ await ที่นี่

    const borrow = await prisma.borrow.findUnique({
      where: { id: Number(id) },
      include: {
        user: true,
        asset: true,
        borrowLocation: true,
      },
    });

    if (!borrow) return NextResponse.json({ error: "Borrow not found" }, { status: 404 });

    return NextResponse.json(borrow, { status: 200 });
  } catch (error) {
    console.error("Error fetching borrow record:", error);
    return NextResponse.json({ error: "Failed to fetch borrow record" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;  // ใช้ await ที่นี่
    const { Borrowstatus, ReturnStatus, dayReturn } = await request.json();

    // ตรวจสอบว่า dayReturn ถ้าได้รับมา ต้องเป็นรูปแบบที่ถูกต้อง
    let formattedDayReturn: Date | undefined;
    if (dayReturn) {
      const parsedDate = new Date(dayReturn);
      if (isNaN(parsedDate.getTime())) {
        return NextResponse.json({ error: "Invalid dayReturn format" }, { status: 400 });
      }
      formattedDayReturn = parsedDate;
    }

    // อัพเดตข้อมูลการยืม
    const updatedBorrow = await prisma.borrow.update({
      where: { id: Number(id) },
      data: {
        Borrowstatus,
        ReturnStatus,
        dayReturn: formattedDayReturn,
      },
    });

    return NextResponse.json(updatedBorrow, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error updating borrow" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;  // ใช้ await ที่นี่

    const deleteAsset = await prisma.borrow.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(deleteAsset, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}