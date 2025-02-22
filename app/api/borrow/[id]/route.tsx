import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    // Await params ก่อนใช้งาน
    const { id } = await params;

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

export async function PUT(req: Request) {
  try {
    const { id, Borrowstatus, ReturnStatus, dayReturn } = await req.json();

    // ตรวจสอบว่ามี id หรือไม่
    if (!id) {
      return NextResponse.json({ error: "Borrow ID is required" }, { status: 400 });
    }

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
      where: { id },
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


export async function DELETE(
    request: Request,
    context: { params: { id: string } }
) {
    try {
        //  ต้อง await ก่อนเข้าถึงค่า params
        const { id } = await context.params;

        const deleteAsset = await prisma.borrow.delete({
            where: { id: parseInt(id) },
        });

        return Response.json(deleteAsset);
    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
        });
    }
}
