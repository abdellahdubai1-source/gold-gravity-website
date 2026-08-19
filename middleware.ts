import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { locales, defaultLocale } from "@/i18n/config";

const PUBLIC_FILE = /\.(.*)$/;

function getLocaleFromPath(pathname: string) {
  const segment = pathname.split("/")[1];
  return locales.includes(segment as (typeof locales)[number]) ? segment : null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const localeInPath = getLocaleFromPath(pathname);

  // Redirect bare "/" or missing-locale paths to the default locale,
  // preserving the rest of the path (e.g. /products -> /en/products).
  if (!localeInPath) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  // Refresh the Supabase auth session cookie on every request so
  // server components always see an up-to-date session.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminRoute = pathname.match(/^\/[a-z]{2}\/admin(?!\/login)/);
  const isAdminLogin = pathname.match(/^\/[a-z]{2}\/admin\/login/);

  if (isAdminRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = `/${localeInPath}/admin/login`;
    return NextResponse.redirect(url);
  }

  if (isAdminLogin && user) {
    const url = request.nextUrl.clone();
    url.pathname = `/${localeInPath}/admin`;
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|images|favicon.ico).*)"],
};
