import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Admin-only sections of the dashboard.
const ADMIN_PATHS = ["/dashboard/verifications", "/dashboard/users"];
// Filing requires a verified account (blocks unverified attorneys).
const VERIFIED_PATHS = ["/dashboard/cases/new"];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    if (ADMIN_PATHS.some((p) => pathname.startsWith(p)) && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (VERIFIED_PATHS.some((p) => pathname.startsWith(p)) && !token?.verified) {
      return NextResponse.redirect(new URL("/dashboard?denied=verification", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Returning false sends the user to the signIn page (with callbackUrl).
      authorized: ({ token }) => !!token,
    },
    pages: { signIn: "/login" },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"],
};
