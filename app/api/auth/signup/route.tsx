import prisma from "@/lib/prisma"; 
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server'; 



export async function POST(request: Request) {
  try {
    const { username, password, name,surname } = await request.json()
    const hashedPassword = await bcrypt.hash(password, 10) 

    const user = await prisma.user.create({
      data: {
        name,
        username,
        password: hashedPassword,
        surname
      },
    })

    return new Response(JSON.stringify({ message: 'User created', user }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'User could not be created' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}



export async function GET(req: NextRequest) {
  // ตรวจสอบว่า req.query มีค่าแล้วหรือไม่
  const page = req.nextUrl.searchParams.get('page') ? parseInt(req.nextUrl.searchParams.get('page')!) : 1;
  const limit = req.nextUrl.searchParams.get('limit') ? parseInt(req.nextUrl.searchParams.get('limit')!) : 15;

  // ตรวจสอบว่า page และ limit เป็นตัวเลขที่สามารถใช้ได้หรือไม่
  if (isNaN(page) || isNaN(limit)) {
    return NextResponse.json({ error: "Invalid page or limit" }, { status: 400 });
  }

  const offset = (page - 1) * limit;

  try {
    const users = await prisma.user.findMany({
      skip: offset,
      take: limit,
    });

    const totalCount = await prisma.user.count();

    return NextResponse.json({
      users,
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
