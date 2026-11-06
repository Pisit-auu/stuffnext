import { currentUser, unauthorized, isAdmin, forbidden, publicUserSelect } from "@/lib/authz";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; 

//ดึงข้อมูล
export async function GET(req: Request) {
  const me = await currentUser();
  if (!me) return unauthorized();
  if (!isAdmin(me)) return forbidden();
  try {
    const borrowList = await prisma.borrow.findMany({
      include: {
        user: { select: publicUserSelect },
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

//สร้างรายการยืม
export async function POST(req: Request) {
  const me = await currentUser();
  if (!me) return unauthorized();
  try {
    const { userId, assetId, borrowLocationId,returnLocationId,
       dayReturn,note, valueBorrow } = await req.json();
    if (!isAdmin(me) && String(userId) !== String(me.id)) {
      return forbidden("ยืมแทนผู้ใช้อื่นไม่ได้");
    }
    if (!userId || !assetId || !borrowLocationId 
      ||!returnLocationId|| valueBorrow === undefined) {
      return NextResponse.json({ error: "Missing required fields" }
        , { status: 400 });
    }
    // แปลง userId เป็น Int
    const userIdInt = isAdmin(me) ? parseInt(userId, 10) : parseInt(me.id, 10);
    if (isNaN(userIdInt)) {
      return NextResponse.json({ error: "Invalid userId format" },
        { status: 400 });
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
    console.error("Error creating borrow:", 
      error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Error creating borrow" }, 
      { status: 500 });
  }
}