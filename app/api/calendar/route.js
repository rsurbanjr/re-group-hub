import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { action, accessToken, event, eventId } = await request.json();
    
    if (!accessToken) {
      return NextResponse.json({ error: 'No access token provided' }, { status: 401 });
    }
    
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    
    if (action === 'listCalendars') {
      const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', { headers });
      const data = await response.json();
      return NextResponse.json(data);
    }
    
    if (action === 'listEvents') {
      const now = new Date().toISOString();
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now}&maxResults=50&singleEvents=true&orderBy=startTime`,
        { headers }
      );
      const data = await response.json();
      return NextResponse.json(data);
    }
    
    if (action === 'createEvent') {
      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        { method: 'POST', headers, body: JSON.stringify(event) }
      );
      const data = await response.json();
      return NextResponse.json(data);
    }
    
    if (action === 'updateEvent') {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
        { method: 'PUT', headers, body: JSON.stringify(event) }
      );
      const data = await response.json();
      return NextResponse.json(data);
    }
    
    if (action === 'deleteEvent') {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
        { method: 'DELETE', headers }
      );
      if (response.status === 204) {
        return NextResponse.json({ success: true });
      }
      const data = await response.json();
      return NextResponse.json(data);
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Calendar API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { refreshToken } = await request.json();
    
    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token provided' }, { status: 401 });
    }
    
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
