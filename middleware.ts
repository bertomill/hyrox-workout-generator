/**
 * Next.js Middleware
 * 
 * Runs on every request to refresh Supabase auth sessions
 */

import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Simple pass-through for now
  // Supabase auth is handled client-side
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
