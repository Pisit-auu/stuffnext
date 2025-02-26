// handler.ts
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export const handler = NextAuth(authOptions);