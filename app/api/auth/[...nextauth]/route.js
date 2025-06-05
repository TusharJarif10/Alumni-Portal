import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { query } from "@/lib/db"; // Import your PostgreSQL query function
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Query user from PostgreSQL
          const result = await query(
            'SELECT * FROM users WHERE email = $1',
            [credentials.email]
          );
          
          if (result.rows.length === 0) {
            throw new Error("User not found");
          }
          
          const user = result.rows[0];
          
          // Check if user is ACTIVE and has ADMIN role
          if (user.status !== "ACTIVE" || user.role !== "ADMIN") {
            throw new Error("You are not authorized to access the admin panel.");
          }
          
          // Compare passwords
          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );
          
          if (!passwordMatch) throw new Error("Invalid password");
          
          return { 
            id: user.id, 
            email: user.email, 
            name: user.name, 
            role: user.role 
          };
          
        } catch (error) {
          console.error("Authentication error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };