import { createClient } from '@/lib/supabase/server';

export type SiteContent = Record<string, Record<string, unknown>>;

export async function getSiteContent(locale: string): Promise<SiteContent> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('site_content')
    .select('section, content')
    .eq('locale', locale);

  const content: SiteContent = {};
  if (data) {
    for (const row of data) {
      content[row.section] = row.content as Record<string, unknown>;
    }
  }
  return content;
}

/**
 * Get visibility settings for sections.
 * Returns a map of section key -> boolean (true = visible).
 * Defaults to all sections visible when no DB data exists.
 */
export function getVisibility(
  siteContent: SiteContent,
): Record<string, boolean> {
  const vis = siteContent['_visibility'];
  if (vis && typeof vis === 'object') {
    return vis as Record<string, boolean>;
  }
  return {};
}
