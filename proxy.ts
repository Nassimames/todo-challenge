import { type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

const i18nMiddleware = createMiddleware({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "always",
});

export default function proxy(request: NextRequest) {
  return i18nMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico|.*\\..*).*)",
  ],
};
