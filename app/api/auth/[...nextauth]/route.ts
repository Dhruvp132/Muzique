/* eslint-disable @typescript-eslint/no-unused-vars */
import { authOptions } from "@/app/lib/auth";
import NextAuth from "next-auth"

const handler = NextAuth(authOptions);
//or const export const POST = handler 
export { handler as GET, handler as POST }