import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    username?: string;
    role?: string;
    image?: string | null; // แก้ให้รองรับ null
  }

  interface Session {
    user: User & {
      id: string;
      username?: string;
      role?: string;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username?: string;
    role?: string;
    image?: string | null;
  }
}
