import { currentUser, unauthorized, isAdmin, forbidden, publicUserSelect } from "@/lib/authz";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
//ดึงข้อมูล ตาม id
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const me = await currentUser();
  if (!me) return unauthorized();
  try {
    const { id } = await context.params; 

    const borrow = await prisma.borrow.findUnique({
      where: { id: Number(id) },
      include: {
        user: { select: publicUserSelect },
        asset: true,
        borrowLocation: true,
      },
    });

    if (!borrow) return NextResponse.json({ error: "Borrow not found" }, { status: 404 });
    if (!isAdmin(me) && String(borrow.userId) !== String(me.id)) return forbidden();

    return NextResponse.json(borrow, { status: 200 });
  } catch (error) {
    console.error("Error fetching borrow record:", error);
    return NextResponse.json({ error: "Failed to fetch borrow record" }, { status: 500 });
  }
}
// อัพเดตข้อใูลตาม id
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const me = await currentUser();
  if (!me) return unauthorized();
  try {
    const { id } = await context.params; 
    const { Borrowstatus, ReturnStatus, dayReturn } = await request.json();
    const existing = await prisma.borrow.findUnique({ where: { id: Number(id) } });
    if (!existing) return NextResponse.json({ error: "Borrow not found" }, { status: 404 });
    const admin = isAdmin(me);
    if (!admin && String(existing.userId) !== String(me.id)) return forbidden();

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
        // ผู้ใช้ทั่วไปแก้ได้แค่วันคืน สถานะอนุมัติเป็นงานของแอดมิน
        Borrowstatus: admin ? Borrowstatus : undefined,
        ReturnStatus: admin ? ReturnStatus : undefined,
        dayReturn: dayReturn ? formattedDayReturn : null,
      },
    });

    return NextResponse.json(updatedBorrow, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error updating borrow" }, { status: 500 });
  }
}
// ลบข้อมูลตามid
export async function DELETE(request: Request,
   context: { params: Promise<{ id: string }> }) {
  const me = await currentUser();
  if (!me) return unauthorized();
  try {
    const { id } = await context.params;

    const existing = await prisma.borrow.findUnique({ where: { id: Number(id) } });
    if (!existing) return NextResponse.json({ error: "Borrow not found" }, { status: 404 });
    if (!isAdmin(me) && String(existing.userId) !== String(me.id)) return forbidden();
    const deleteAsset = await prisma.borrow.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(deleteAsset, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" },
       { status: 500 });
  }
}