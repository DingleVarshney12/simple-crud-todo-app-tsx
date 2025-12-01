import NextAuth, { NextAuthConfig, Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { User as UserTs } from "next-auth";
import { JWT } from "next-auth/jwt";

export const authOptions = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, request) {
        await connectDb();
        const email = credentials.email;
        const password = credentials.password as string;
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("User Doesn't Exist");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error("Password is Incorrect");
        }
        return {
          id: user._id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }: { token: JWT; user?: UserTs }) {
      if (user) {
        token.id = user.id;
        token.name = user.name as string;
        token.email = user.email as string;
      }
      return token;
    },
    session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  },
  secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };