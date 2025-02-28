import prisma from "@/lib/prisma"; 
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const searchCategory = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || 'desc'; 

    let whereCondition: any = {
        asset: {
            name: {
                contains: search,
                mode: 'insensitive',
            },
        },
    };

    if (searchCategory) {
        whereCondition.asset.category = {
            name: searchCategory,
        };
    }

    try {
        const assets = await prisma.assetLocation.findMany({
            where: whereCondition,
            orderBy: {
                asset: {
                    createdAt: sort as 'asc' | 'desc', // ใช้ 'asc' หรือ 'desc' สำหรับการเรียงลำดับ
                },
            },
            include: {
                asset: true,
                location: true,
            },
        });

        return new Response(JSON.stringify(assets), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching assets:", error);
        return new Response(JSON.stringify({ error: "Error fetching assets" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export async function POST(request: Request){
    const { assetId, locationId, inRoomavailableValue, inRoomaunavailableValue } = await request.json();

    // ตรวจสอบว่า inRoomavailableValue และ inRoomaunavailableValue เป็นตัวเลขที่ถูกต้อง
    const intInRoomavailableValue = parseInt(inRoomavailableValue, 10);
    const intUnavailableValueNumber = parseInt(inRoomaunavailableValue, 10);

    if (isNaN(intInRoomavailableValue) || isNaN(intUnavailableValueNumber)) {
        return new Response("Invalid number format", { status: 400 });
    }

    try {
        // สร้างข้อมูลใหม่ใน assetLocation
        const newassetlocation = await prisma.assetLocation.create({
            data: {
                asset: { connect: { assetid: assetId } }, 
                location: { connect: { namelocation: locationId } }, 
                inRoomavailableValue: intInRoomavailableValue,
                inRoomaunavailableValue: intUnavailableValueNumber,
            },
        });

        const existingAsset = await prisma.asset.findUnique({
            where: { assetid: assetId },
            select: { availableValue: true, unavailableValue: true },
        });

        if (!existingAsset) {
            return new Response("Asset not found", { status: 404 });
        }

        // อัปเดตค่า availableValue และ unavailableValue
        const updatedAsset = await prisma.asset.update({
            where: { assetid: assetId },
            data: {
                availableValue: existingAsset.availableValue - intInRoomavailableValue,
                unavailableValue: existingAsset.unavailableValue - intUnavailableValueNumber,
            },
        });

        return Response.json({ newassetlocation, updatedAsset });
    } catch (error) {
        console.error("Error in POST request:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
