import prisma from "@/lib/prisma"; 
import bcrypt from 'bcryptjs';



export async function POST(request: Request) {
  try {
    const { username, password, name } = await request.json()
    const hashedPassword = await bcrypt.hash(password, 10) 

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        name,
      },
    })

    return new Response(JSON.stringify({ message: 'User created', user }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'User could not be created' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function GET(request: Request) {
  try {
    const users = await prisma.user.findMany() // ดึงข้อมูลผู้ใช้ทั้งหมดจากฐานข้อมูล

    return new Response(JSON.stringify({ users }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'ไม่สามารถดึงข้อมูลผู้ใช้ได้' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
