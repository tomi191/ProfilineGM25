import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = new Set(['image/webp', 'image/png', 'image/jpeg']);

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

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided.' },
        { status: 400 },
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: webp, png, jpeg.' },
        { status: 400 },
      );
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5 MB.' },
        { status: 400 },
      );
    }

    // Generate unique filename
    const filename = `${Date.now()}-${file.name}`;

    // Read file into buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage using admin client
    const adminSupabase = createAdminClient();
    const { data, error } = await adminSupabase.storage
      .from('site-media')
      .upload(filename, buffer, { contentType: file.type });

    if (error) {
      console.error('Supabase storage upload error:', error);
      return NextResponse.json(
        { error: 'Failed to upload file.' },
        { status: 500 },
      );
    }

    // Return public URL
    const {
      data: { publicUrl },
    } = adminSupabase.storage.from('site-media').getPublicUrl(data.path);

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 },
    );
  }
}
