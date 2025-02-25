import prisma from "@/lib/prisma"; 
export async function GET(
    request: Request,
    context: { params: { id: string } }
) {
    // ✅ ต้องใช้ await ก่อนเข้าถึงค่า params
    const { id } = await context.params;
        const result = await prisma.asset.findUnique({
        where: { assetid: id },
        include: { category: true },
    });

    return Response.json(result);
}

export async function PUT(
    request: Request,
    context: { params: { id: string } }
) {
    try {
        const { name, img, assetid, categoryId, availableValue, unavailableValue } =
            await request.json();

        // ✅ ต้อง await ก่อนเข้าถึงค่า params
        const { id } = await context.params;

        const availableValueNumber = Number(availableValue);
        const unavailableValueNumber = Number(unavailableValue);

        if (isNaN(availableValueNumber) || isNaN(unavailableValueNumber)) {
            return new Response(JSON.stringify({ error: "Invalid number format" }), {
                status: 400,
            });
        }

        const update = await prisma.asset.update({
            where: { assetid: id },
            data: {
                name,
                img,
                assetid,
                categoryId,
                availableValue: availableValueNumber,
                unavailableValue: unavailableValueNumber,
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

        const deleteAsset = await prisma.asset.delete({
            where: { assetid: id },
        });

        return Response.json(deleteAsset);
    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
        });
    }
}
