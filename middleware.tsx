import { getToken } from 'next-auth/jwt'
import { NextResponse, NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

 // console.log("Middleware Token:", token);

  const user = token as { role?: string } | null;
  const { pathname } = request.nextUrl;

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  // เพิ่มผู้ใช้ได้เฉพาะ superadmin
  if (pathname.startsWith('/admin/user/singupuser') && user?.role !== 'superadmin') {
    return NextResponse.redirect(new URL(isAdmin ? '/admin/user' : '/', request.url));
  }

  if (pathname.startsWith('/admin') && !isAdmin) {
  //  console.log("Unauthorized User:", user);
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}
