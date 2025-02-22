import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const borrowList = await prisma.borrow.findMany({
      include: {
        user: true,
        asset: true,
        borrowLocation: true, // ดึงแค่ borrowLocation
      },
    });

    return NextResponse.json(borrowList, { status: 200 });
  } catch (error) {
    console.error("Error fetching borrow list:", error);
    return NextResponse.json({ error: "Error fetching borrow list" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const { userId, assetId, borrowLocationId,returnLocationId, dayReturn,note, valueBorrow } = await req.json();

    if (!userId || !assetId || !borrowLocationId ||!returnLocationId|| valueBorrow === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // แปลง userId เป็น Int
    const userIdInt = parseInt(userId, 10);
    if (isNaN(userIdInt)) {
      return NextResponse.json({ error: "Invalid userId format" }, { status: 400 });
    }

    // การสร้างข้อมูลการยืมใหม่
    const newBorrow = await prisma.borrow.create({
      data: {
        userId: userIdInt,  // ส่ง userId ในรูปแบบ Int
        assetId,
        borrowLocationId,
        returnLocationId,
        dayReturn: dayReturn ? new Date(dayReturn) : null,
        note,
        valueBorrow: parseInt(valueBorrow, 10), // แปลง valueBorrow เป็น Int
      },
    });

    return NextResponse.json(newBorrow, { status: 201 });
  } catch (error: any) {
    console.error("Error creating borrow:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Error creating borrow" }, { status: 500 });
  }
}