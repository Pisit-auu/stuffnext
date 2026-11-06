import { currentUser, unauthorized, isAdmin, forbidden, publicUserSelect } from "@/lib/authz";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
//ดึงข้อมูลตาม id user
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const me = await currentUser();
  if (!me) return unauthorized();
  try {
    const { id } = await context.params;
    if (!isAdmin(me) && String(id) !== String(me.id)) return forbidden();

    // ดึงข้อมูลจากฐานข้อมูลตาม userId
    const borrowList = await prisma.borrow.findMany({
      where: { userId: Number(id) },
      include: {
        user: { select: publicUserSelect },
        asset: true,
        borrowLocation: true,
      },
    });

    return NextResponse.json(borrowList, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching borrow history' }, { status: 500 });
  }
}