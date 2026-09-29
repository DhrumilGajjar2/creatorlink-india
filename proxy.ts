// proxy.ts  (Next.js 16 — replaces middleware.ts)
// Protect /dashboard routes — redirect to /login if not authenticated
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    const token = req.cookies.get("cl_token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    const session = await verifyToken(token);
    if (!session) {
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.delete("cl_token");
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
