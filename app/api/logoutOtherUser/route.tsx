// src/app/api/logoutOtherUser/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // ใช้ตัวแปร authOptions ที่คุณสร้างไว้ในไฟล์ก่อนหน้านี้


export async function POST(request: Request) {
  try {
    // ตรวจสอบว่าเรามี session สำหรับผู้ใช้ที่ทำการ request หรือไม่
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { user } = session;
    const body = await request.json();
    const { targetUserId } = body; // รับ targetUserId จาก request body

    // ตรวจสอบให้แน่ใจว่า admin หรือผู้ที่ทำการ logout สามารถ logout ผู้ใช้อื่น
    if (user?.role !== 'admin') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    if (!targetUserId) {
      return new NextResponse('Target user ID is required', { status: 400 });
    }

    // คุณสามารถทำการ logout หรือ invalidate token สำหรับ targetUserId ในที่นี้
    // (ถ้าใช้ JWT สามารถ revoke หรือทำให้ session หมดอายุ)

    // ตัวอย่างการทำให้ token ของผู้ใช้ที่ระบุหมดอายุ
    // คุณสามารถใช้ redis หรือฐานข้อมูลเพื่อเก็บข้อมูล session และทำให้หมดอายุ

    return NextResponse.json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error('Error in logout:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
