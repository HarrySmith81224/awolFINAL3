import authConfig from "./auth.config";
import NextAuth from "next-auth";
import { privateRoutes } from "./routes";

const { auth } = NextAuth(authConfig)

export default auth(async (req) => {
    // Check if user is logged in
    const isLoggedIn = !!req.auth;
    // Get the next URL from the request
    const { nextUrl } = req;
    // Define the base URL for redirects
    const url = 'https://awol-final-3.vercel.app/';
    // Check if the current route is a private route
    const isPrivateRoute = privateRoutes.includes(nextUrl.pathname);
    // Check if the current route is an authentication route
    const isAuthRoute = nextUrl.pathname.includes("/auth");
    // Check if the current route is an API route
    const isApiRoute = nextUrl.pathname.includes("/api");

    // Allow all API routes to pass through
    if (isApiRoute) {
        return;
    }

    // Redirect logged-in users away from auth routes to home page
    if (isLoggedIn && isAuthRoute) {
        return Response.redirect(`${url}/`);
    }

    // Allow API routes to pass through even if user is not logged in
    if (isApiRoute && !isLoggedIn) {
        return;
    }

    // Redirect unauthenticated users to login page when accessing private routes
    if (!isLoggedIn && isPrivateRoute) {
        return Response.redirect(`${url}/auth/login`)
    }
})


export const config = {
    matcher: ['/((?!.+.[w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}