import prisma from "@/lib/prisma"; 

export async function GET(
    request: Request,
    context: { params: { id: string } }
) {
    // ✅ ต้องใช้ await ก่อนเข้าถึงค่า params
    const { id } = await context.params;

    const result = await prisma.assetLocation.findUnique({
        where: {id:parseInt(id) },
        include: { asset: true ,location:true},
    });

    return Response.json(result);
}

export async function PUT(
    request: Request,
    context: { params: { id: string } }
) {
    try {
        const { assetId, locationId, inRoomavailableValue, inRoomaunavailableValue } = await request.json();
        
        // ✅ ดึง params id
        const { id } = await context.params;  // ใช้ await ในการเข้าถึง params

        const availableValueNumber = Number(inRoomavailableValue);
        const unavailableValueNumber = Number(inRoomaunavailableValue);

        if (isNaN(availableValueNumber) || isNaN(unavailableValueNumber)) {
            return new Response(JSON.stringify({ error: "Invalid number format" }), {
                status: 400,
            });
        }

        // ตรวจสอบว่า inRoomavailableValue และ inRoomaunavailableValue เป็น 0 หรือไม่
        if (availableValueNumber === 0 && unavailableValueNumber === 0) {
            // ถ้าทั้งสองค่าเป็น 0 ให้ลบ AssetLocation ออกจากฐานข้อมูล
            await prisma.assetLocation.delete({
                where: { id: parseInt(id) },
            });

            return new Response(JSON.stringify({ message: "AssetLocation deleted due to zero values" }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }

        // ถ้าไม่เป็น 0 ก็ทำการอัปเดตปกติ
        const update = await prisma.assetLocation.update({
            where: { id: parseInt(id) },
            data: {
                assetId,
                locationId,
                inRoomavailableValue: availableValueNumber,
                inRoomaunavailableValue: unavailableValueNumber,
            },
        });

        return new Response(JSON.stringify({ update }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";

        return new Response(JSON.stringify({ error: errorMessage }), {
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

        const deleteAsset = await prisma.assetLocation.delete({
            where: { id: parseInt(id) },
        });

        return Response.json(deleteAsset);
    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
        });
    }
}
