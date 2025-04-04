'use client';

import { SessionProvider } from 'next-auth/react';


// nextJS does not allow session provider to be used in the root layout, so it must be set up externally then imported.
export function NextAuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}