import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";


//ดึงครุภัณฑ์ตาม id
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;  // ใช้ await ที่นี่

  try {
    const result = await prisma.asset.findUnique({
      where: { assetid: id },
      include: { category: true },
    });

    if (!result) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
//update ครุภัณฑ์ ตาม ตาม id
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;  // ใช้ await ที่นี่
    const { name, img, assetid, categoryId, availableValue, unavailableValue } = await request.json();

    const availableValueNumber = Number(availableValue);
    const unavailableValueNumber = Number(unavailableValue);

    if (isNaN(availableValueNumber) || isNaN(unavailableValueNumber)) {
      return NextResponse.json({ error: 'Invalid number format' }, { status: 400 });
    }

    const update = await prisma.asset.update({
      where: { assetid: id },
      data: {
        name,
        img,
        assetid,
        categoryId,
        availableValue: availableValueNumber,
        unavailableValue: unavailableValueNumber,
      },
    });

    return NextResponse.json(update);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

//ลบ ครุภัณฑ์ ตาม id
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;  // ใช้ await ที่นี่

    const deleteAsset = await prisma.asset.delete({
      where: { assetid: id },
    });

    return NextResponse.json(deleteAsset);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}