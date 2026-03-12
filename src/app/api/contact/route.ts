import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// Simple in-memory rate limiting
const rateLimit = new Map<string, { count: number; resetTime: number }>();

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 5 requests per IP per hour
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const now = Date.now();
    const windowMs = 60 * 60 * 1000; // 1 hour
    const maxRequests = 5;

    const rateLimitInfo = rateLimit.get(ip);
    if (rateLimitInfo) {
      if (now < rateLimitInfo.resetTime) {
        if (rateLimitInfo.count >= maxRequests) {
          return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            { status: 429 }
          );
        }
        rateLimitInfo.count++;
      } else {
        rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
      }
    } else {
      rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    }

    // Parse body
    const body = await request.json();
    const { name, email, company, country, expected_volume, message, locale } = body;

    // Validate required fields
    if (!name || !email || !company || !country) {
      return NextResponse.json(
        { error: 'Name, email, company, and country are required.' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address.' },
        { status: 400 }
      );
    }

    // Insert into Supabase
    const supabase = createAdminClient();
    const { error: dbError } = await supabase
      .from('inquiries')
      .insert({
        name,
        email,
        company,
        country,
        expected_volume: expected_volume || null,
        message: message || null,
        locale: locale || 'en',
        status: 'new',
      });

    if (dbError) {
      console.error('Supabase error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save inquiry.' },
        { status: 500 }
      );
    }

    // Send emails via Resend when API key is configured
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        // Admin notification
        await resend.emails.send({
          from: 'Profiline GM25 <noreply@profilinegm25.eu>',
          to: process.env.ADMIN_EMAIL || 'contact@profilinegm25.eu',
          subject: `New Distributor Inquiry — ${company} (${country})`,
          html: `
            <h2>New B2B Inquiry</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Company:</strong> ${company}</p>
            <p><strong>Country:</strong> ${country}</p>
            <p><strong>Expected Volume:</strong> ${expected_volume || 'Not specified'}</p>
            <p><strong>Message:</strong></p>
            <p>${message || 'No message'}</p>
            <hr/>
            <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin">View in Admin Panel</a></p>
          `,
        });

        // Distributor confirmation
        const isBulgarian = locale === 'bg';
        await resend.emails.send({
          from: 'Profiline GM25 <noreply@profilinegm25.eu>',
          to: email,
          subject: isBulgarian
            ? 'Благодарим за вашето запитване — Profiline GM25'
            : 'Thank you for your inquiry — Profiline GM25',
          html: isBulgarian
            ? `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #050505; padding: 30px; text-align: center;">
                  <h1 style="color: #A3E635; margin: 0;">PROFILINE GM25</h1>
                </div>
                <div style="padding: 30px; background: #111; color: #ccc;">
                  <h2 style="color: #fff;">Получихме вашето запитване!</h2>
                  <p>Здравейте, ${name},</p>
                  <p>Благодарим ви за интереса към партньорство с Profiline. Нашият екип ще разгледа заявлението ви и ще се свърже с вас в рамките на <strong>48 часа</strong>.</p>
                  <h3 style="color: #A3E635;">Вашите данни:</h3>
                  <p><strong>Компания:</strong> ${company}</p>
                  <p><strong>Държава:</strong> ${country}</p>
                  <p><strong>Очакван обем:</strong> ${expected_volume || 'Не е посочен'}</p>
                  <hr style="border-color: #333;"/>
                  <p style="font-size: 12px; color: #666;">Profiline Tools | contact@profilinegm25.eu</p>
                </div>
              </div>
            `
            : `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #050505; padding: 30px; text-align: center;">
                  <h1 style="color: #A3E635; margin: 0;">PROFILINE GM25</h1>
                </div>
                <div style="padding: 30px; background: #111; color: #ccc;">
                  <h2 style="color: #fff;">We received your inquiry!</h2>
                  <p>Hello ${name},</p>
                  <p>Thank you for your interest in partnering with Profiline. Our team will review your application and respond within <strong>48 hours</strong>.</p>
                  <h3 style="color: #A3E635;">Your details:</h3>
                  <p><strong>Company:</strong> ${company}</p>
                  <p><strong>Country:</strong> ${country}</p>
                  <p><strong>Expected Volume:</strong> ${expected_volume || 'Not specified'}</p>
                  <hr style="border-color: #333;"/>
                  <p style="font-size: 12px; color: #666;">Profiline Tools | contact@profilinegm25.eu</p>
                </div>
              </div>
            `,
        });
      } catch (emailError) {
        console.error('Email error:', emailError);
        // Don't fail the request if email fails — inquiry is already saved
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
