import { NextAuthOptions } from "next-auth";
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
            id: String(user.id), // Ensure the id is included
            name: user.name,
            username: user.username,
            role: user.role,
            email: user.email,
            image: user.image,
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
    strategy: 'jwt', // Use JWT for session management
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.name = user.name;  // ✅ เพิ่ม name เข้า token
        token.role = user.role;
        token.username = user.username;
        token.email = user.email;
        token.image = user.image;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name; // ✅ เพิ่ม name เข้า session
        session.user.role = token.role;
        session.user.username = token.username;
        session.user.image = token.image;
      }
      return session;
    },
  },
  
};