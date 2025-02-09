import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/app/cloudinary';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

  try {
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: 'uploads',
    });

    return NextResponse.json({ url: uploadResponse.secure_url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/*
export async function DELETE(req: NextRequest) {
  try {
    const { public_id } = await req.json(); // รับข้อมูล public_id จาก body ของ request

    if (!public_id) {
      return NextResponse.json({ error: 'Public ID is required' }, { status: 400 });
    }

    // ลบไฟล์จาก Cloudinary
    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === 'ok') {
      return NextResponse.json({ message: 'File deleted successfully' });
    } else {
      return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}*/