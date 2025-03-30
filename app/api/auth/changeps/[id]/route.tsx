import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
// อัพเดตรหัสผ่าน ของuser ตาม id
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  // รอให้ params resolve ก่อนแล้วดึงค่า id
  const { id } = await context.params;
  const { oldPassword, newPassword } = await request.json(); // รับข้อมูลจาก body ของ request

  if (typeof id !== 'string') {
    return new Response(JSON.stringify({ message: 'Username is required' }), { status: 400 });
  }

  try {
    // ค้นหาผู้ใช้จากฐานข้อมูล
    const user = await prisma.user.findUnique({
      where: { username: id },
    });

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    // ตรวจสอบรหัสผ่านเก่า
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ message: 'Old password is incorrect' }), { status: 400 });
    }

    // เข้ารหัสรหัสผ่านใหม่
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // อัปเดตฐานข้อมูล
    await prisma.user.update({
      where: { username: id },
      data: { password: hashedNewPassword },
    });

    return new Response(JSON.stringify({ message: 'Password updated successfully' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Error updating password' }), { status: 500 });
  }
}

