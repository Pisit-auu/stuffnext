import prisma from "@/lib/prisma"; 
import { type NextRequest } from "next/server";
//ดึงข้อมูลทั้งหมด
export async function GET(request:NextRequest){
    const seaarchParams = request.nextUrl.searchParams // รับ request 
    const search = seaarchParams.get('search') || '' //ดึงค่า search จาก URL
    const category = await prisma.categoryroom.findMany({
        where:{
            name: {
                contains: search,
                mode: 'insensitive'
            }
            
        }
    })
    return Response.json(category)
}

//สร้างข้อมูล
export async function POST(request: Request){
    try{
        const {name} = await request.json()
        const newcategory = await prisma.categoryroom.create({
            data:{
                name
            }
        })
        return Response.json(newcategory)  
    }catch (error){
        return new Response(error as BodyInit,{
            status:500,
        })
    }
}