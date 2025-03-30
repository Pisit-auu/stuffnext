import prisma from "@/lib/prisma"; 
import { type NextRequest } from "next/server";
//ดึงข้อมูล asset loaction ในห้อง ตามที่ search
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locationFilter = searchParams.get('location') || '';  // รับค่าจาก query parameter หรือเป็นค่าว่าง

  try {
    const assets = await prisma.assetLocation.findMany({
      include: {
        asset: {
          include: {
            category: true, // ดึง location ของ asset
          },
        },
        location: true,
      },
      where: {
        location: {
          namelocation: locationFilter, // กรองตาม namelocation
        },
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
