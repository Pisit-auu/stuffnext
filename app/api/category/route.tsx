import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET(){
    const category = await prisma.category.findMany()
    return Response.json(category)
}

export async function POST(request: Request){
    const {idname,name} = await request.json()
    const newcategory = await prisma.category.create({
        data:{
            idname,
            name
        }
    })
    return Response.json(newcategory)
}