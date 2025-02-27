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

  if (pathname.startsWith('/admin') && (!user || user.role !== 'admin')) {
  //  console.log("Unauthorized User:", user);
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}
