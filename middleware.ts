import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Mock Mode: Bypass auth if cookie is set
  const isMock = process.env.NEXT_PUBLIC_MOCK_MODE === "true";
  if (isMock) {
    const mockToken = req.cookies.get("mock-token")?.value;
    // If accessing protected route without mock token, redirect to login
    const p = req.nextUrl.pathname;
    if ((p.startsWith("/admin") || p.startsWith("/cliente")) && !mockToken) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/login";
      return NextResponse.redirect(redirectUrl);
    }
    // If token exists, allow access (logic assumes token implies valid role for now)
    return res;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string, value: string, options?: any }[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          res.cookies.set(name, value, options);
        });
      },
    },
  });

  // Refresh session if needed.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const p = req.nextUrl.pathname;
  const protectedRoute = p.startsWith("/admin") || p.startsWith("/cliente");

  if (!protectedRoute) return res;

  if (!user) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", p);
    return NextResponse.redirect(redirectUrl);
  }

  const role =
    (user as any).app_metadata?.role || (user as any).user_metadata?.role || "CLIENTE";

  if (p.startsWith("/admin") && role !== "ADMIN") {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/cliente";
    return NextResponse.redirect(redirectUrl);
  }

  if (p.startsWith("/cliente") && role !== "CLIENTE") {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/admin";
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/cliente/:path*"],
};
