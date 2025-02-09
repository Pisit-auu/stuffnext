import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await  params;

        const result = await prisma.location.findUnique({
            where: { namelocation: id }, 
        });

        if (!result) {
            return new Response(JSON.stringify({ error: "Location not found" }), { status: 404 });
        }

        return Response.json(result);
    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { namelocation, nameteacher } = await request.json();
        const { id } = await  params;

        const update = await prisma.location.update({
            where: { namelocation: id }, 
            data: { namelocation, nameteacher },
        });

        return Response.json(update);
    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        const deletelocation = await prisma.location.delete({
            where: { namelocation: id }, 
        });

        return Response.json(deletelocation);
    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
