import {clerkMiddleware, createRouteMatcher} from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/debate(.*)', '/presentation-skills(.*)'])

export default clerkMiddleware(async (auth, req) => {
    // Restrict routes to logged-in users
    if (isProtectedRoute(req)) {
        await auth.protect((has) => {
            return true; // always bounce the user
        })
    }
})
export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};