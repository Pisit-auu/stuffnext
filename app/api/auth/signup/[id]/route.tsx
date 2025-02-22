import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export async function GET(
    request: Request,
    context: { params: { id: string } }
) {
    // ✅ ต้องใช้ await ก่อนเข้าถึงค่า params
    const { id } = await context.params;

    const result = await prisma.user.findUnique({
        where: { username: id },
        //include: { category: true },
    });

    return Response.json(result);
}


export async function PUT(
    request: Request,
    context: { params: { id: string } }
) {
    try {
        const { name, surname , username, password, email, tel,image,role } =
        await request.json();

        // ✅ ต้อง await ก่อนเข้าถึงค่า params
        const { id } = await context.params;
        const hashedPassword = await bcrypt.hash(password, 10)
  

        const update = await prisma.user.update({
            where: { username: id },
            data: {
                name, 
                surname, 
                username,  
                email, 
                tel,
                image,
                role 
            },
        });

        return Response.json(update);
    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
        });
    }
}


export async function DELETE(
    request: Request,
    context: { params: { id: string } }
) {
    try {
        //  ต้อง await ก่อนเข้าถึงค่า params
        const { id } = await context.params;

        const deleteAsset = await prisma.user.delete({
            where: { username: id },
        });

        return Response.json(deleteAsset);
    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
        });
    }
}
