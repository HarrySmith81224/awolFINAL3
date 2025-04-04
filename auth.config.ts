import Credentials from 'next-auth/providers/credentials';
import type { NextAuthConfig } from 'next-auth';
import { LoginSchema } from './schemas';
import { prisma } from '@/prisma/prisma';
import bcrypt from 'bcryptjs';



export default {

  providers: [Credentials({
    async authorize(credentials) {
      // Validate credentials against LoginSchema
      const validatedData = LoginSchema.safeParse(credentials);
      // Return null if validation fails
      if(!validatedData.success) return null;
      
      // Extract email and password from validated data
      const { email, password } = validatedData.data;
      
      // Find user in database by email
      const user = await prisma.user.findFirst({
        where: {
          email: email,
        },
      });
      
      // Return null if user not found
      if (!user) {
        return null;
      }

      // Compare provided password with hashed password in database using bcrypt
      const passwordsMatch = await bcrypt.compare(password, user.password);

      // Return user object if passwords match, null otherwise
      if(passwordsMatch) {
        return user;
      }
      return null;
    }
  })],
} satisfies NextAuthConfig;
