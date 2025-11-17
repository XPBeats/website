import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

declare module "next-auth" {
  interface User {
    role?: string
  }
  
  interface Session {
    user: User & {
      id: string
      role?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }