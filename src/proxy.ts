import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|login|api/auth/login).*)",
  ],
};

export function proxy(req: NextRequest) {
  const token = req.cookies.get("secret")?.value;

  if (token === process.env.PERSONAL_SECRET) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", req.url));
}
