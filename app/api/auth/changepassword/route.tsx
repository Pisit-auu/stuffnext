import { NextRequest, NextResponse } from 'next/server'; // Use NextRequest and NextResponse
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions'; // Adjust the path to your auth options
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { oldPassword, newPassword } = await req.json(); // Parse the request body

  // ตรวจสอบ session
  const session = await getServerSession(authOptions); // Use getServerSession without req/res

  if (!session) {
    return NextResponse.json(
      { message: 'Not authenticated' },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { username: session.user.username },
  });

  if (!user || !bcrypt.compareSync(oldPassword, user.password)) {
    return NextResponse.json(
      { message: 'Invalid old password' },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { username: session.user.username },
    data: { password: hashedPassword },
  });

  return NextResponse.json(
    { message: 'Password changed successfully' },
    { status: 200 }
  );
}