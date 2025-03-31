
import { type NextRequest } from "next/server";
import prisma from "@/lib/prisma"; 


export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams; // รับ request 
    const search = searchParams.get('search') || '';   //ดึงค่า search จาก URL
    const categoryroom = searchParams.get('categoryroom'); //ค้นหา query parameter ที่ชื่อว่า categoryroom ใน URL

    const whereCondition: any = {
        namelocation: {
            contains: search,
            mode: 'insensitive',
        },
    };

    // ถ้า categoryroom มีค่า ให้ใช้เงื่อนไขค้นหา
    if (categoryroom) {
        whereCondition.categoryroom = {
            name: {
                contains: categoryroom,
                mode: 'insensitive',
            },
        };
    }

    const location = await prisma.location.findMany({
        where: whereCondition,
        include: {
            categoryroom: true, 
        },
    });

    return Response.json(location);
}


  
  

export async function POST(request: Request){
  try {
    const { namelocation, nameteacher, 
        categoryIdroom } = await request.json();
    // กำหนดประเภทของตัวแปร data เพื่อรองรับ categoryIdroom
    const data: { namelocation: string; 
        nameteacher: string; categoryIdroom?: string 
    } = {
        namelocation,
        nameteacher,
    };
    // เพิ่ม categoryIdroom เฉพาะเมื่อมีค่า
    if (categoryIdroom) {
        data.categoryIdroom = categoryIdroom;
    }

    // สร้าง location ใหม่ด้วยข้อมูลที่เตรียมไว้
    const newLocation = await prisma.location.create({
        data: data,
    });

    return Response.json(newLocation);
} catch (error) {
  if (error instanceof Error) {
      return Response.json({ error: 'เกิดข้อผิดพลาด', details: error.message });
  } else {
      return Response.json({ error: 'เกิดข้อผิดพลาดที่ไม่สามารถระบุได้' });
  }
}
}

