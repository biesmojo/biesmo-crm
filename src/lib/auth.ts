import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/validations";

export const { handlers, auth, signIn, signOut } = NextAuth({
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                const validation = loginSchema.safeParse(credentials);
                if (!validation.success) return null;

                const { email, password } = validation.data;
                const user = await prisma.user.findUnique({
                    where: { email },
                });
                if (!user) return null;

                const passwordMatch = await bcrypt.compare(
                    password, user.password
                );
                if (!passwordMatch) return null;

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
});