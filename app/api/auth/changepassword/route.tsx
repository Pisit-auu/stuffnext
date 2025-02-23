import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { oldPassword, newPassword } = await req.json();

  // ตรวจสอบ session
  const session = await getSession({ req });

  if (!session) {
    return new Response(
      JSON.stringify({ message: 'Not authenticated' }),
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { username: session.user.username },
  });

  if (!user || !bcrypt.compareSync(oldPassword, user.password)) {
    return new Response(
      JSON.stringify({ message: 'Invalid old password' }),
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { username: session.user.username },
    data: { password: hashedPassword },
  });

  return new Response(
    JSON.stringify({ message: 'Password changed successfully' }),
    { status: 200 }
  );
}
