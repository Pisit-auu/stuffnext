import prisma from "@/lib/prisma"; 
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const searchCategory = searchParams.get('category') || ''
    const sort = searchParams.get('sort') || 'desc'
  
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
        }
  
    try {
      const assets = await prisma.asset.findMany({
        where: whereCondition as any,
        orderBy: {
          createdAt: sort,
        } as any,
        include: {
          category: true,
        },
      })
  
      return Response.json(assets)
    } catch (error) {
      console.error('Error fetching assets:', error)
      return new Response('Error fetching assets', { status: 500 })
    }
  }

export async function POST(request: Request){
    const {name,img,assetid,categoryId,availableValue,unavailableValue} = await request.json()
    const availableValueNumber = parseInt(availableValue, 10);
    const unavailableValueNumber = parseInt(unavailableValue, 10);
    try{
        const newasset = await prisma.asset.create({
            data: {
                name,
                img,
                assetid,
                categoryId,
                availableValue: availableValueNumber,
                unavailableValue: unavailableValueNumber,
              },
        })
        return Response.json(newasset)
    }catch (error){
        return new Response(error as BodyInit,{
            status:500,
        })
    }
}