import { NextRequest, NextResponse } from 'next/server';
import {
  SITE_HOST,
  shouldIndexRequest,
  shouldRedirectToCanonical,
} from './lib/seo';

export function middleware(request: NextRequest) {
  const requestHost =
    request.headers.get('x-forwarded-host') || request.headers.get('host');

  if (shouldRedirectToCanonical(requestHost)) {
    const canonicalUrl = request.nextUrl.clone();
    canonicalUrl.protocol = 'https';
    canonicalUrl.hostname = SITE_HOST;
    canonicalUrl.port = '';

    return NextResponse.redirect(canonicalUrl, 301);
  }

  const response = NextResponse.next();

  if (!shouldIndexRequest(requestHost)) {
    response.headers.set(
      'X-Robots-Tag',
      'noindex, nofollow, noarchive, noimageindex'
    );
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|robots.txt|sitemap.xml|opengraph-image|icon|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
