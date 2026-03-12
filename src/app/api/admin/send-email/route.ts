import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    // Verify admin session
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse body
    const { to, subject, body, inquiry_id, inquiry_name } = await request.json();

    if (!to || !subject || !body || !inquiry_id) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, body, inquiry_id' },
        { status: 400 }
      );
    }

    // Send email via Resend
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Email service is not configured.' },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #050505; padding: 30px; text-align: center;">
          <h1 style="color: #A3E635; margin: 0;">PROFILINE GM25</h1>
        </div>
        <div style="padding: 30px; background: #111; color: #ccc;">
          ${body.replace(/\n/g, '<br/>')}
          <hr style="border-color: #333; margin-top: 30px;"/>
          <p style="font-size: 12px; color: #666;">Profiline Tools | contact@profilinegm25.eu</p>
        </div>
      </div>
    `;

    const { error: sendError } = await resend.emails.send({
      from: 'Profiline GM25 <noreply@profilinegm25.eu>',
      to,
      subject,
      html: htmlBody,
    });

    if (sendError) {
      console.error('Resend error:', sendError);
      return NextResponse.json(
        { error: 'Failed to send email.' },
        { status: 500 }
      );
    }

    // Insert activity record using admin client (service role)
    const adminSupabase = createAdminClient();
    const { error: activityError } = await adminSupabase
      .from('inquiry_activity')
      .insert({
        inquiry_id,
        type: 'email_sent',
        metadata: { subject, to },
      });

    if (activityError) {
      console.error('Activity insert error:', activityError);
      // Email was sent successfully, don't fail the whole request
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Send email API error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
