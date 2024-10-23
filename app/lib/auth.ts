import prismaClient from "@/app/lib/db";
import { NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Define interface for customized session type
interface CustomSession extends Session {
  user: {
    id?: string;
    email: string;
  };
}

// Define interface for customized JWT type
interface CustomToken extends JWT {
  email?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET ?? "secret",

  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      try {
        await prismaClient.user.create({
          data: {
            email: user.email,
            provider: "Google",
          },
        });
      } catch (e) {
        console.log(e);
        return false;
      }

      return true;
    },

    async jwt({ token, user }) {
      const customToken: CustomToken = token as CustomToken;
      if (user && user.email) {
        customToken.email = user.email;
      }
      return customToken;
    },

    async session({ session, token }) {
      const customSession: CustomSession = session as CustomSession;
      if (token?.email && customSession.user) {
        customSession.user.email = token.email;
      }
      return customSession;
    },
  },
};

export default NextAuth(authOptions);
