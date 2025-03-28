import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  const result = await prisma.categoryroom.findUnique({
    where: { id: parseInt(id,10) },
  });

  return NextResponse.json(result);
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const {  name } = await request.json();

    const { id } = await context.params;

    const update = await prisma.categoryroom.update({
      where: { id: parseInt(id,10) },
      data: {
        name,
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

    const deletecategory = await prisma.categoryroom.delete({
      where: { id: parseInt(id,10) },
    });

    return NextResponse.json(deletecategory);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}