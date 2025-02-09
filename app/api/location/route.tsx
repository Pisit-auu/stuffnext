import { PrismaClient } from "@prisma/client"
import { type NextRequest } from "next/server";
const prisma = new PrismaClient()

export async function GET(request:NextRequest){
    const seaarchParams = request.nextUrl.searchParams
    const search = seaarchParams.get('search') || ''
    const location = await prisma.location.findMany({
        where:{
            namelocation : {
                contains: search,
                mode: 'insensitive'
            }
            
        }
    })
    return Response.json(location)
}

export async function POST(request: Request){
    try{
        const {namelocation,nameteacher} = await request.json()
        const newlocation = await prisma.location.create({
            data:{
                namelocation,
                nameteacher
            }
        })
        return Response.json(newlocation)  
    }catch (error){
        return new Response(error as BodyInit,{
            status:500,
        })
    }
}