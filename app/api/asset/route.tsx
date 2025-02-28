import prisma from "@/lib/prisma"; 
import { type NextRequest } from "next/server";
import { redis } from '@/lib/redis';  // ใช้ named import แทน default import

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search') || '';
  const searchCategory = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'desc';

  let whereCondition = searchCategory
    ? {
        category: {
          name: searchCategory, // ใช้ 'category' ในที่นี้เพื่อค้นหาตาม category
        },
        name: {
          contains: search,
          mode: 'insensitive',
        },
      }
    : {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      };

  const cacheKey = `assets:${search}:${searchCategory}:${sort}`; // สร้าง key สำหรับ cache

  try {
    // ตรวจสอบว่า data อยู่ใน cache หรือไม่
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      console.log('Returning cached data');
      return Response.json(JSON.parse(cachedData));
    }

    // ถ้าไม่พบใน cache ให้ query จากฐานข้อมูล
    const assets = await prisma.asset.findMany({
      where: whereCondition as any,
      orderBy: {
        createdAt: sort,
      } as any,
      include: {
        category: true,
      },
    });

    // เก็บผลลัพธ์ใน cache เพื่อใช้งานครั้งถัดไป
    await redis.set(cacheKey, JSON.stringify(assets), {
      EX: 3600, 
    });

    return Response.json(assets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    return new Response('Error fetching assets', { status: 500 });
  }
}

export async function POST(request: Request) {
  const { name, img, assetid, categoryId, availableValue, unavailableValue } = await request.json();
  const availableValueNumber = parseInt(availableValue, 10);
  const unavailableValueNumber = parseInt(unavailableValue, 10);

  try {
    const newAsset = await prisma.asset.create({
      data: {
        name,
        img,
        assetid,
        categoryId,
        availableValue: availableValueNumber,
        unavailableValue: unavailableValueNumber,
      },
    });

    // ลบ cache เพื่อให้ข้อมูลใหม่ถูกโหลดในครั้งถัดไป
    const cacheKey = `assets:${name}:${categoryId}`;
    await redis.del(cacheKey);

    return Response.json(newAsset);
  } catch (error) {
    return new Response(error as BodyInit, {
      status: 500,
    });
  }
}