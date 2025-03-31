import bcrypt from 'bcryptjs';
import prisma from "@/lib/prisma";
//ดึงข้อมูล user ตาม id
export async function GET(request: Request, 
  context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;  

  const result = await prisma.user.findUnique({
    where: { username: id },
  });

  return Response.json(result);
}
//อัพเดตข้อมูล ตาม id
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    // รับข้อมูลที่อาจจะมีค่าบางฟิลด์ที่ต้องการอัปเดต
    const { name, surname, username, password, email, tel, image, role } = await request.json();
    // ต้อง await ก่อนเข้าถึงค่า params
    const { id } = await context.params;
    // ใช้ bcrypt แฮชรหัสผ่าน ถ้ามีการเปลี่ยนแปลง
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    // เตรียมข้อมูลที่ต้องการอัปเดต
    const updateData: any = {};
    if (name) updateData.name = name;
    if (surname) updateData.surname = surname;
    if (username) updateData.username = username;
    if (hashedPassword) updateData.password = password;
    if (email) updateData.email = email;
    if (tel) updateData.tel = tel;
    if (image) updateData.image = image;
    if (role) updateData.role = role;
    // อัปเดตข้อมูลในฐานข้อมูล
    const update = await prisma.user.update({
      where: { username: id },
      data: updateData,
    });
    return Response.json(update);
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
//ลบ ข้อมูลตาม id
export async function DELETE(request: Request, 
  context: { params: Promise<{ id: string }> }) {
  try {
    //  ต้อง await ก่อนเข้าถึงค่า params
    const { id } = await context.params;

    const deleteuser = await prisma.user.delete({
      where: { id: parseInt(id, 10) },
    });

    return Response.json(deleteuser);
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: "Internal Server Error" }), {
      status: 500,
    });
  }
}