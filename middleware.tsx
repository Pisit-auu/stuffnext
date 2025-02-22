import { getToken } from 'next-auth/jwt'
import { NextResponse, NextRequest } from 'next/server'

interface User {
  role: string
}

export async function middleware(request: NextRequest) {
  const user = await getToken<User>({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Get the pathname of the request
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/admin') &&
    (!user || user.role !== 'admin')
  ) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}
