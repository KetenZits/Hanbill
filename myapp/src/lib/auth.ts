import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials' // ตรงนี้ OK แล้ว
import { validatePassword } from "@/services/userService"
import session from './../../node_modules/next-auth/core/routes/session.d';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({ 
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
        async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
                return null;
            }

            try {
                const user = await validatePassword(credentials.email, credentials.password);
                if (!user) return null;
                
                return { 
                    id: String(user.id),
                    email: user.email, 
                    name: user.name || null
                };
            } catch (error) {
                console.error('Auth error:', error);
                return null;
            }
        }
    }),
  ],
  pages: {
    signIn : '/auth/signin',
  },
  callbacks: {
        async jwt({ token, user }){
            if(user) token.user = user.id;
            return token;
        },
        async session({ session, token }){
            if(token){
                session.user.id = token.user as string;
            }
            return session;
        },
    },
};