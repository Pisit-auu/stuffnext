import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = await params;

    const result = await prisma.category.findUnique({
        where: { idname: id }
    });

    return Response.json(result);
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { idname, name } = await request.json();

        const { id } = await params;

        const update = await prisma.category.update({
            where: { idname: id },
            data: {
                idname,
                name
            }
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
    { params }: { params: { id: string } }
) {
    try {

        const { id } = await params;

        const deletecategory = await prisma.category.delete({
            where: { idname: id },
        });

        return Response.json(deletecategory);
    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
        });
    }
}
