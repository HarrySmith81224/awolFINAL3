import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma/prisma';
import authConfig from './auth.config';
import { getUserById } from './data/user';

// Export NextAuth configuration and handlers
export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  // Use Prisma adapter for database operations
  adapter: PrismaAdapter(prisma),
  // Configure session strategy to use JWT
  session: { strategy: 'jwt' },
  // Spread the auth configuration from auth.config.ts
  ...authConfig,
  callbacks: {
    // Sign in callback - validate user before allowing sign in
    async signIn({ user }) {
      if (!user.id) {
        return false
      }
      return true
    },
    // JWT callback - customize the JWT token
    async jwt({token}) {
      // Return token if no user ID is present
      if(!token.sub) return token;
      
      // Fetch user data from database
      const existingUser = await getUserById(token.sub);
      if(!existingUser) return token;

      // Add user data to the token
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.image = existingUser.image;
      token.role = existingUser.role;

      return token;
    },
    async session({token, session}) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          role: token.role
        }
      }
    }
  }
});