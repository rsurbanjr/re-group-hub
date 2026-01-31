
Copy

// Google OAuth callback route
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  
  if (error) {
    return NextResponse.redirect(new URL('/?google_auth=error&message=' + error, request.url));
  }
  
  if (!code) {
    return NextResponse.redirect(new URL('/?google_auth=error&message=no_code', request.url));
  }
  
  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI || 'https://re-group-hub.vercel.app/api/auth/google/callback',
        grant_type: 'authorization_code',
      }),
    });
    
    const tokens = await tokenResponse.json();
    
    if (tokens.error) {
      console.error('Token error:', tokens);
      return NextResponse.redirect(new URL('/?google_auth=error&message=' + tokens.error, request.url));
    }
    
    const redirectUrl = new URL('/', request.url);
    redirectUrl.searchParams.set('google_auth', 'success');
    redirectUrl.searchParams.set('access_token', tokens.access_token);
    redirectUrl.searchParams.set('refresh_token', tokens.refresh_token || '');
    redirectUrl.searchParams.set('expires_in', tokens.expires_in);
    
    return NextResponse.redirect(redirectUrl.toString());
  } catch (err) {
    console.error('OAuth callback error:', err);
    return NextResponse.redirect(new URL('/?google_auth=error&message=server_error', request.url));
  }
}
