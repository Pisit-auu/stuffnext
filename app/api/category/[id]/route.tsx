import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET(
    request: Request,
    {params} : {params : { id:string} }
){
    const categoryid =  params.id
    const result =  await prisma.category.findUnique({
        where:{
            idname: categoryid
        }
    })
    return Response.json(result);
}

export async function PUT(
    request: Request,
    {params} : {params : { id:string} }
){
    try{
        const {idname,name} = await request.json()
    const categoryid =  params.id
    const update =  await prisma.category.update({
        where:{idname: categoryid},
        data:{
            idname,
            name
        }
    })
    return Response.json(update);
    }catch (error){
        return new Response(error as BodyInit,{
            status:500,
        })
    }
}

export async function DELETE(
    request: Request,
    {params} : {params : { id:string} }
){
    try{
        const categoryid =  params.id
    const deletecategory =  await prisma.category.delete({
        where:{idname: categoryid},
    })
    return Response.json(deletecategory);
    }catch (error){
        return new Response(error as BodyInit,{
            status:500,
        })
    }
}