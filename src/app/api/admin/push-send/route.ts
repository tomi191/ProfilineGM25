import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendPushToAll } from '@/lib/push-send';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, body: notifBody, url } = body as {
      title: string;
      body: string;
      url?: string;
    };

    if (!title || !notifBody) {
      return NextResponse.json(
        { error: 'Title and body are required.' },
        { status: 400 },
      );
    }

    await sendPushToAll({ title, body: notifBody, url });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Push send API error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 },
    );
  }
}
