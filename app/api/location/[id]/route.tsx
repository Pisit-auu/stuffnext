import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;  // ใช้ await ที่นี่

    const result = await prisma.location.findUnique({
      where: { namelocation: id }, include: {
        categoryroom : true,
      }
    });

    if (!result) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { namelocation, nameteacher, categoryIdroom } = await request.json();
    const { id } = await context.params; 

    const update = await prisma.location.update({
      where: { namelocation: id },
      data: {
        namelocation,
        nameteacher,
        categoryIdroom: categoryIdroom || null, 
      },
    });

    return NextResponse.json(update);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const deletelocation = await prisma.location.delete({
      where: { namelocation: id },
    });

    return NextResponse.json(deletelocation);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}