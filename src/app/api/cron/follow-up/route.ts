import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();

  // Find inquiries with status='new' created more than 48 hours ago
  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

  const { data: staleInquiries, error: fetchError } = await supabase
    .from('inquiries')
    .select('id, name, company, email, created_at')
    .eq('status', 'new')
    .lt('created_at', cutoff);

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (!staleInquiries || staleInquiries.length === 0) {
    return NextResponse.json({ message: 'No follow-ups needed', count: 0 });
  }

  let created = 0;

  for (const inquiry of staleInquiries) {
    // Check if a follow-up reminder already exists for this inquiry
    const { data: existing } = await supabase
      .from('notifications')
      .select('id')
      .eq('inquiry_id', inquiry.id)
      .eq('type', 'follow_up_reminder')
      .limit(1);

    if (existing && existing.length > 0) continue;

    // Create follow-up reminder notification
    const { error: insertError } = await supabase
      .from('notifications')
      .insert({
        type: 'follow_up_reminder',
        title: 'Follow-up needed',
        body: `${inquiry.name}${inquiry.company ? ` (${inquiry.company})` : ''} — unanswered for 48+ hours`,
        inquiry_id: inquiry.id,
        read: false,
      });

    if (!insertError) created++;
  }

  return NextResponse.json({
    message: `Created ${created} follow-up reminders`,
    count: created,
  });
}
