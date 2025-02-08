import { PrismaClient } from "@prisma/client"
import { type NextRequest } from "next/server";
const prisma = new PrismaClient()

export async function GET(request:NextRequest){
    const seaarchParams = request.nextUrl.searchParams
    const search = seaarchParams.get('search') || ''
    const category = await prisma.category.findMany({
        where:{
            name: {
                contains: search,
                mode: 'insensitive'
            }
            
        }
    })
    return Response.json(category)
}

export async function POST(request: Request){
    try{
        const {idname,name} = await request.json()
        const newcategory = await prisma.category.create({
            data:{
                idname,
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