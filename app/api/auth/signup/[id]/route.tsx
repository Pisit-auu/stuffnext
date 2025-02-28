import bcrypt from 'bcryptjs';
import prisma from "@/lib/prisma";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;  // ใช้ await ที่นี่

  const result = await prisma.user.findUnique({
    where: { username: id },
    //include: { category: true },
  });

  return Response.json(result);
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { name, surname, username, password, email, tel, image, role } = await request.json();

    // ✅ ต้อง await ก่อนเข้าถึงค่า params
    const { id } = await context.params;
    const hashedPassword = await bcrypt.hash(password, 10);

    const update = await prisma.user.update({
      where: { username: id },
      data: {
        name,
        surname,
        username,
        password,
        email,
        tel,
        image,
        role,
      },
    });

    return Response.json(update);
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    //  ต้อง await ก่อนเข้าถึงค่า params
    const { id } = await context.params;

    const deleteuser = await prisma.user.delete({
      where: { id: parseInt(id, 10) },
    });

    return Response.json(deleteuser);
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}