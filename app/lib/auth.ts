import prismaClient from "@/app/lib/db";
import { NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Define interface for customized session type
interface CustomSession extends Session {
  user: {
    id: string;
    email: string;
  };
}

// Define interface for customized JWT type
interface CustomToken extends JWT {
  email?: string;
  id? : string; 
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
        let existingOrNewUser = await prismaClient.user.findUnique({
          where: {
            email: user.email,
          },
        });
        if(!existingOrNewUser) {
          existingOrNewUser = await prismaClient.user.create({
            data: {
              email: user.email,
              provider: "Google",
            },
          });
        }
        //user.id is differnt than the user id in the model User
        user.id = existingOrNewUser?.id ?? "" 
      } catch (e) {
        console.log(e);
        return false;
      }

      return true;
    },

    async jwt({ token, user }) {
      const customToken: CustomToken = token as CustomToken;
      if (user && user.email && user.id) {
        customToken.email = user.email;
        customToken.id = user.id 
      }
      return customToken;
    },

    // the defautl token is the JWT token and that doesn't have the id in that so check the custom Token 
    // async session({ session, token }) {
    //   const customSession: CustomSession = session as CustomSession;
    //   if (token?.email && customSession.user && token?.id) {
    //     customSession.user.email = token.email;
    //     customSession.user.id = token.id
    //   }
    //   return customSession;
    // },
    async session({ session, token }) {
      const customSession: CustomSession = session as CustomSession;
      const customToken: CustomToken = token as CustomToken;
      if (customToken?.email && customSession.user && customToken?.id) {
        customSession.user.email = customToken.email;
        customSession.user.id = customToken.id
      }
      return customSession;
    },
  },
};

export default NextAuth(authOptions);
