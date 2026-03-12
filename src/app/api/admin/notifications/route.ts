import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Notifications fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch notifications.' },
        { status: 500 }
      );
    }

    const unreadCount = (notifications ?? []).filter((n) => !n.read).length;

    return NextResponse.json({ notifications: notifications ?? [], unreadCount });
  } catch (error) {
    console.error('Notifications API error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { ids, all } = body as { ids?: string[]; all?: boolean };

    if (all) {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('read', false);

      if (error) {
        console.error('Mark all read error:', error);
        return NextResponse.json(
          { error: 'Failed to mark notifications as read.' },
          { status: 500 }
        );
      }
    } else if (ids && ids.length > 0) {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .in('id', ids);

      if (error) {
        console.error('Mark read error:', error);
        return NextResponse.json(
          { error: 'Failed to mark notifications as read.' },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Provide "ids" array or "all: true".' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notifications PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
