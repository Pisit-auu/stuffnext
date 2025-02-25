import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';
import { PrismaAdapter } from '@auth/prisma-adapter';

import prisma from "@/lib/prisma"; 


if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET is not set in .env file');
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'your_username' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        try {
          const user = await prisma.user.findUnique({
            where: { username: credentials.username },
          });

          if (!user) {
            throw new Error('User not found');
          }

          const isValidPassword = await bcrypt.compare(credentials.password, user.password);
          if (!isValidPassword) {
            throw new Error('Invalid password');
          }

          return {
            id: String(user.id), // แปลง id เป็น string
            name: user.name,
            username: user.username,
            role: user.role,
          };
        } catch (error) {
          console.error('Error in authorize:', error);
          throw new Error('CredentialsSignin');
        }
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt', // ใช้ JWT แทน session ใน cookie
  },
  callbacks: {
    // เรียกใช้ callback jwt เพื่อจัดเก็บข้อมูลใน token
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;  // เพิ่ม username ใน token
        token.email = user.email;  // เพิ่ม email ใน token
        token.image = user.image;  // เพิ่ม image ใน token
      }
      return token;
    },
    // ใช้ session callback เพื่อจัดการ session ให้ใช้ข้อมูลจาก token
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.username = token.username;  // เพิ่ม username ใน session
        session.user.email = token.email;  // เพิ่ม email ใน session
        session.user.image = token.image;  // เพิ่ม image ใน session
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };