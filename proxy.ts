import { cookies } from "next/headers";
import { parseSetCookie } from "cookie";
import { NextResponse, type NextRequest } from "next/server";
import { checkSession } from "@/lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

type RefreshedCookie = {
  name: string;
  value: string;
  options: Omit<ReturnType<typeof parseSetCookie>, "name" | "value">;
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (!isPrivateRoute && !isPublicRoute) {
    return NextResponse.next();
  }

  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  let isAuthenticated = Boolean(accessToken);
  const refreshedCookies: RefreshedCookie[] = [];

  if (!accessToken && refreshToken) {
    try {
      const sessionResponse = await checkSession(cookieStore.toString());

      isAuthenticated = sessionResponse.data.success;

      const setCookie = sessionResponse.headers["set-cookie"];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

        for (const cookieStr of cookieArray) {
          const { name, value, ...options } = parseSetCookie(cookieStr);

          if (value !== undefined) {
            refreshedCookies.push({
              name,
              value,
              options,
            });
          }
        }
      }
    } catch {
      isAuthenticated = false;
    }
  }

  const requestHeaders = new Headers(request.headers);

  if (refreshedCookies.length > 0) {
    const updatedCookies = new Map(
      cookieStore.getAll().map(({ name, value }) => [name, value]),
    );

    for (const cookie of refreshedCookies) {
      updatedCookies.set(cookie.name, cookie.value);
    }

    const cookieHeader = Array.from(
      updatedCookies,
      ([name, value]) => `${name}=${value}`,
    ).join("; ");

    requestHeaders.set("cookie", cookieHeader);
  }

  let response: NextResponse;

  if (isPrivateRoute && !isAuthenticated) {
    response = NextResponse.redirect(new URL("/sign-in", request.url));
  } else if (isPublicRoute && isAuthenticated) {
    response = NextResponse.redirect(new URL("/", request.url));
  } else {
    response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  for (const cookie of refreshedCookies) {
    response.cookies.set(cookie.name, cookie.value, cookie.options);
  }

  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
