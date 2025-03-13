
import { type NextRequest } from "next/server";
import prisma from "@/lib/prisma"; 


export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';  
    const categoryroom = searchParams.get('categoryroom') || ''; 
  
    const location = await prisma.location.findMany({
      where: {
        AND: [
          {
            namelocation: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            categoryroom: {
              name: {
                contains: categoryroom,
                mode: 'insensitive',
              },
            },
          },
        ],
      },
      include: {
        categoryroom: true,
      },
    });
  
    return Response.json(location);
  }
  
  

export async function POST(request: Request){
    try{
        const {namelocation,nameteacher,categoryIdroom} = await request.json()
        const newlocation = await prisma.location.create({
            data:{
                namelocation,
                nameteacher,
                categoryIdroom
            }
        })
        return Response.json(newlocation)  
    }catch (error){
        return new Response(error as BodyInit,{
            status:500,
        })
    }
}