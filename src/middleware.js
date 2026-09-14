// middleware.ts
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("pathshala_session")?.value || "";

  if (request.nextUrl.pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  } else if (request.nextUrl.pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If not starting with /dashboard, continue with the request
  return NextResponse.next();
}

// Optional: You can further customize the matcher if needed
export const config = {
  matcher: ["/dashboard/:path*", "/login/:path*"],
};
