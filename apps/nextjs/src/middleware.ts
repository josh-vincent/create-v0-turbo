import { updateSession } from "@tocld/supabase/middleware";
import { createClient } from "@tocld/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

import { authConfig } from "~/lib/auth-config";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Skip auth in mock mode
  if (authConfig.isMockMode) {
    const nextUrl = request.nextUrl;
    const isAuthPage = nextUrl.pathname === "/login" || nextUrl.pathname === "/signup";

    // Redirect to home if trying to access auth pages in mock mode
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return response;
  }

  const { response: updatedResponse } = await updateSession(request, response);

  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const nextUrl = request.nextUrl;
  const isAuthPage = nextUrl.pathname === "/login" || nextUrl.pathname === "/signup";

  // Redirect to login if not authenticated (except for auth pages)
  if (!session && !isAuthPage) {
    const url = new URL("/login", request.url);
    const returnTo = `${nextUrl.pathname}${nextUrl.search}`;

    if (returnTo && returnTo !== "/") {
      url.searchParams.set("return_to", returnTo);
    }

    return NextResponse.redirect(url);
  }

  // Redirect to home if authenticated and trying to access auth pages
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return updatedResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
