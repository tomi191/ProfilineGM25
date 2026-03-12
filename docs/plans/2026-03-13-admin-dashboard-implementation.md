# Admin Dashboard Full Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the minimal admin into a full B2B management system with CRM, analytics, content management, and real-time notifications.

**Architecture:** Modular admin in the existing Next.js 16 app. Each module is a separate route under `/app/[locale]/admin/*`. Supabase for DB/Auth/Storage. Resend for emails. recharts for charts. Web Push API for notifications.

**Tech Stack:** Next.js 16, Supabase (DB + Auth + Storage + Edge Functions), Resend, recharts, Web Push API, Tailwind CSS v4

---

## Phase 1: Foundation (DB + Layout)

### Task 1: Create Supabase tables via MCP

Use the Supabase MCP `execute_sql` tool. Project ID: `cqcgrjpyvokulnhozvsj`

**Step 1: Run migration SQL**

```sql
-- inquiry_notes
CREATE TABLE inquiry_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id uuid NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE inquiry_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage notes" ON inquiry_notes
  FOR ALL USING (auth.role() = 'authenticated');

-- inquiry_activity
CREATE TABLE inquiry_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id uuid NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
  type text NOT NULL, -- 'status_change', 'note_added', 'email_sent', 'created'
  metadata jsonb DEFAULT '{}',
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE inquiry_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage activity" ON inquiry_activity
  FOR ALL USING (auth.role() = 'authenticated');

-- email_templates
CREATE TABLE email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  locale text DEFAULT 'en',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage templates" ON email_templates
  FOR ALL USING (auth.role() = 'authenticated');

-- site_content
CREATE TABLE site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  locale text NOT NULL DEFAULT 'bg',
  content jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id),
  UNIQUE(section, locale)
);
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage content" ON site_content
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Anyone can read content" ON site_content
  FOR SELECT USING (true);

-- notifications
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL, -- 'new_inquiry', 'follow_up_reminder', 'status_change'
  title text NOT NULL,
  body text,
  inquiry_id uuid REFERENCES inquiries(id) ON DELETE SET NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage notifications" ON notifications
  FOR ALL USING (auth.role() = 'authenticated');

-- push_subscriptions
CREATE TABLE push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint text NOT NULL,
  keys_p256dh text NOT NULL,
  keys_auth text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(endpoint)
);
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own subscriptions" ON push_subscriptions
  FOR ALL USING (auth.uid() = user_id);

-- admin_settings
CREATE TABLE admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email_on_inquiry boolean DEFAULT true,
  push_enabled boolean DEFAULT false,
  followup_reminders boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own settings" ON admin_settings
  FOR ALL USING (auth.uid() = user_id);
```

**Step 2: Seed default email templates**

```sql
INSERT INTO email_templates (name, subject, body, locale) VALUES
  ('Welcome', 'Welcome to the Profiline Partner Program', 'Dear {{name}},\n\nThank you for your interest in becoming a Profiline GM25 distributor. We are excited to explore this partnership with {{company}}.\n\nOur team will prepare a detailed proposal for the {{country}} market and get back to you within 5 business days.\n\nBest regards,\nProfiline Team', 'en'),
  ('Price Quote', 'Profiline GM25 — Price Quote for {{company}}', 'Dear {{name}},\n\nPlease find attached our wholesale pricing for the Profiline GM25 based on your expected volume of {{volume}} units/month.\n\nWe look forward to your feedback.\n\nBest regards,\nProfiline Team', 'en'),
  ('Need More Info', 'Re: Your Profiline GM25 Inquiry', 'Dear {{name}},\n\nThank you for reaching out. To prepare the best offer for {{company}}, we need a few more details:\n\n1. Your current product portfolio\n2. Number of retail locations\n3. Preferred payment terms\n\nLooking forward to hearing from you.\n\nBest regards,\nProfiline Team', 'en'),
  ('Follow-up', 'Following up — Profiline GM25 Partnership', 'Dear {{name}},\n\nI wanted to follow up on our previous communication regarding the Profiline GM25 distribution opportunity in {{country}}.\n\nAre you still interested in exploring this partnership? We would be happy to schedule a call at your convenience.\n\nBest regards,\nProfiline Team', 'en');

INSERT INTO email_templates (name, subject, body, locale) VALUES
  ('Добре дошли', 'Добре дошли в партньорската програма на Profiline', 'Здравейте {{name}},\n\nБлагодарим за интереса ви да станете дистрибутор на Profiline GM25. Вълнуваме се да проучим това партньорство с {{company}}.\n\nНашият екип ще подготви детайлно предложение за пазара в {{country}} и ще се свърже с вас в рамките на 5 работни дни.\n\nС уважение,\nЕкип Profiline', 'bg'),
  ('Ценова оферта', 'Profiline GM25 — Ценова оферта за {{company}}', 'Здравейте {{name}},\n\nИзпращаме ви нашите wholesale цени за Profiline GM25 базирани на очаквания обем от {{volume}} бр./месец.\n\nОчакваме вашата обратна връзка.\n\nС уважение,\nЕкип Profiline', 'bg'),
  ('Нужна информация', 'Относно: Вашето запитване за Profiline GM25', 'Здравейте {{name}},\n\nБлагодарим за запитването. За да подготвим най-добрата оферта за {{company}}, имаме нужда от допълнителни детайли:\n\n1. Текущо продуктово портфолио\n2. Брой търговски обекти\n3. Предпочитани условия за плащане\n\nОчакваме отговор.\n\nС уважение,\nЕкип Profiline', 'bg'),
  ('Последващо', 'Последващо съобщение — Profiline GM25 Партньорство', 'Здравейте {{name}},\n\nИскам да проследя предишната ни комуникация относно дистрибуцията на Profiline GM25 в {{country}}.\n\nВсе още ли имате интерес към партньорството? Ще се радваме да насрочим разговор в удобно за вас време.\n\nС уважение,\nЕкип Profiline', 'bg');
```

**Step 3: Create Supabase Storage bucket**

Use Supabase MCP or SQL:
```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('site-media', 'site-media', true);
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'site-media' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete" ON storage.objects FOR DELETE USING (bucket_id = 'site-media' AND auth.role() = 'authenticated');
CREATE POLICY "Anyone can read" ON storage.objects FOR SELECT USING (bucket_id = 'site-media');
```

**Step 4: Commit** — `feat(admin): add Supabase tables for CRM, content, notifications`

---

### Task 2: Install recharts dependency

**Step 1: Install**

```bash
npm install recharts
```

**Step 2: Commit** — `chore: add recharts dependency`

---

### Task 3: Sidebar layout + AdminShell redesign

**Files:**
- Modify: `src/components/admin/AdminShell.tsx` (full rewrite)
- Create: `src/components/admin/Sidebar.tsx`
- Create: `src/components/admin/NotificationBell.tsx`

**Step 1: Create `src/components/admin/Sidebar.tsx`**

Sidebar component with nav links:
- Dashboard (`/admin`) — LayoutDashboard icon
- Inquiries (`/admin/inquiries`) — Inbox icon
- Analytics (`/admin/analytics`) — BarChart3 icon
- Content (`/admin/content`) — FileText icon
- Settings (`/admin/settings`) — Settings icon

Use `usePathname()` to highlight active link. Collapsible on mobile with hamburger toggle.

**Step 2: Create `src/components/admin/NotificationBell.tsx`**

Client component that:
- Fetches unread notification count from Supabase on mount
- Shows bell icon (lucide `Bell`) with red badge count
- Dropdown on click showing last 5 notifications
- "Mark all as read" button
- "View all" link to `/admin/settings` (notifications section)
- Uses Supabase realtime subscription for live updates

**Step 3: Rewrite `src/components/admin/AdminShell.tsx`**

Replace current flat header with:
- Sticky top bar: logo left, NotificationBell + user email + Logout right
- Sidebar on left (240px desktop, overlay on mobile)
- Main content area with proper padding

```tsx
// Layout structure:
<div className="min-h-screen bg-[#050505]">
  <header> {/* top bar: logo, notification bell, logout */} </header>
  <div className="flex">
    <Sidebar locale={locale} />
    <main className="flex-1 p-6">{children}</main>
  </div>
</div>
```

**Step 4: Commit** — `feat(admin): add sidebar navigation and notification bell`

---

### Task 4: Dashboard overview page (refactor `/admin`)

**Files:**
- Modify: `src/app/[locale]/admin/page.tsx`

**Step 1: Redesign dashboard**

Replace current full inquiries table with overview dashboard:
- StatsCards row (keep existing, add "Conversion Rate" 4th card)
- "Recent Inquiries" — last 5 inquiries in compact table with "View All" link
- "Quick Actions" section: buttons for "Export CSV", "View Analytics"
- "Needs Attention" — inquiries in "new" status for >48h

**Step 2: Commit** — `feat(admin): redesign dashboard overview page`

---

## Phase 2: CRM Module

### Task 5: Enhanced Inquiries list page

**Files:**
- Create: `src/app/[locale]/admin/inquiries/page.tsx`
- Modify: `src/components/admin/InquiriesTable.tsx` (add search, sort, bulk, pagination)

**Step 1: Create inquiries list page**

Server component at `/admin/inquiries/page.tsx`:
- Auth check (redirect if no session)
- Fetch all inquiries from Supabase
- Render AdminShell + InquiriesTable

**Step 2: Enhance InquiriesTable**

Add to existing component:
- **Search bar** at top — filters by name, email, company (client-side filter on `useState`)
- **Sort** — click column header to toggle asc/desc, use `useState` for sort field + direction
- **Bulk actions toolbar** — appears when checkboxes selected:
  - "Mark as Contacted" — batch update status
  - "Export Selected (CSV)" — generate CSV blob + download
  - "Delete Selected" — with confirmation modal
- **Pagination** — 20 per page, Previous/Next buttons, page counter
- **Checkbox column** — first column, select all header checkbox

**Step 3: Add CSV export utility**

Create `src/lib/export-csv.ts`:
```typescript
export function exportToCSV(data: Record<string, unknown>[], filename: string) {
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(','))
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
```

**Step 4: Commit** — `feat(admin): enhanced inquiries list with search, sort, bulk actions, pagination`

---

### Task 6: Inquiry detail page + Activity timeline

**Files:**
- Create: `src/app/[locale]/admin/inquiries/[id]/page.tsx`
- Create: `src/components/admin/InquiryDetail.tsx`
- Create: `src/components/admin/ActivityTimeline.tsx`

**Step 1: Create detail page**

Server component:
- Auth check
- Fetch inquiry by ID from Supabase
- Fetch related notes + activity log (ordered by created_at DESC)
- 404 if inquiry not found
- Render two-column layout

**Step 2: Create `InquiryDetail.tsx`**

Client component — left column:
- Back button (`← Back to Inquiries`)
- Inquiry info card (name, email, company, country, volume, message, locale, created_at)
- Status dropdown (reuse existing logic from InquiriesTable)
- Quick action buttons: "Send Email", "Add Note", "Delete"
- Delete button with confirmation modal

**Step 3: Create `ActivityTimeline.tsx`**

Client component — right column:
- Chronological list of activities (newest first)
- Each entry: icon + type label + metadata + timestamp
- Icons by type:
  - `created` → Plus icon (green)
  - `status_change` → RefreshCw icon (blue)
  - `note_added` → MessageSquare icon (yellow)
  - `email_sent` → Mail icon (purple)
- Metadata display: for `status_change` show "old → new", for `email_sent` show subject

**Step 4: Add auto-logging to status changes**

When status changes in InquiryDetail, also INSERT into `inquiry_activity`:
```typescript
await supabase.from('inquiry_activity').insert({
  inquiry_id: id,
  type: 'status_change',
  metadata: { from: oldStatus, to: newStatus },
  created_by: session.user.id,
});
```

**Step 5: Commit** — `feat(admin): inquiry detail page with activity timeline`

---

### Task 7: Notes system

**Files:**
- Create: `src/components/admin/AddNoteForm.tsx`

**Step 1: Create AddNoteForm**

Client component:
- Textarea + "Add Note" button
- On submit: INSERT into `inquiry_notes` + INSERT into `inquiry_activity` (type: 'note_added')
- Optimistic UI update — append to timeline immediately
- Clear textarea on success

**Step 2: Display notes in ActivityTimeline**

Merge `inquiry_notes` and `inquiry_activity` into single timeline, sorted by `created_at`.

**Step 3: Commit** — `feat(admin): add notes system for inquiries`

---

### Task 8: Email composer modal

**Files:**
- Create: `src/components/admin/EmailComposer.tsx`
- Create: `src/app/api/admin/send-email/route.ts`

**Step 1: Create API route `src/app/api/admin/send-email/route.ts`**

Server route:
- Auth check (verify session via Supabase server client)
- Accepts: `{ to, subject, body, inquiry_id }`
- Template variable replacement: `{{name}}`, `{{company}}`, `{{country}}`, `{{volume}}`
- Send via Resend
- Log in `inquiry_activity` (type: 'email_sent', metadata: { subject, to })
- Return success/error

**Step 2: Create `EmailComposer.tsx`**

Modal component:
- Two tabs: "Templates" | "Custom"
- Templates tab: fetch from `email_templates` table, list as clickable cards, clicking loads subject+body into editor
- Custom tab: subject input + body textarea
- Template variables auto-replaced with inquiry data before preview
- "Preview" / "Send" buttons
- Loading state while sending
- Close modal + refresh timeline on success

**Step 3: Wire into InquiryDetail**

"Send Email" button opens EmailComposer modal, passing inquiry data as props.

**Step 4: Commit** — `feat(admin): email composer with templates and custom emails`

---

## Phase 3: Analytics Module

### Task 9: Analytics page with charts

**Files:**
- Create: `src/app/[locale]/admin/analytics/page.tsx`
- Create: `src/components/admin/charts/InquiriesOverTime.tsx`
- Create: `src/components/admin/charts/ByCountryChart.tsx`
- Create: `src/components/admin/charts/ConversionFunnel.tsx`
- Create: `src/components/admin/charts/ByVolumeChart.tsx`

**Step 1: Create analytics page**

Server component:
- Auth check
- Fetch all inquiries
- Process data into chart-ready formats
- Period selector state (7d/30d/90d) — pass as prop, client component filters

**Step 2: Create `InquiriesOverTime.tsx`**

recharts `LineChart`:
- X-axis: dates, Y-axis: count
- Group inquiries by day
- Lime-400 line color, dark grid, tooltip

**Step 3: Create `ByCountryChart.tsx`**

recharts `BarChart` (horizontal):
- Top 10 countries by inquiry count
- Lime gradient bars

**Step 4: Create `ConversionFunnel.tsx`**

Custom component (not recharts):
- 3 bars: New → Contacted → Closed
- Percentage between each stage
- Color-coded (lime → amber → blue)

**Step 5: Create `ByVolumeChart.tsx`**

recharts `PieChart` (donut):
- 3 segments: 10-50, 50-200, 200+
- Lime/amber/blue colors
- Center label with total

**Step 6: Commit** — `feat(admin): analytics dashboard with 4 charts`

---

## Phase 4: Content Management

### Task 10: Content management page — text editing

**Files:**
- Create: `src/app/[locale]/admin/content/page.tsx`
- Create: `src/components/admin/ContentEditor.tsx`
- Create: `src/components/admin/SectionAccordion.tsx`

**Step 1: Create content page**

Server component:
- Auth check
- Fetch `site_content` rows from Supabase (all sections, both locales)
- Fetch current `messages/bg.json` and `messages/en.json` as fallback defaults
- Pass both to ContentEditor

**Step 2: Create `SectionAccordion.tsx`**

Reusable collapsible accordion:
- Props: title, isOpen, onToggle, children
- Chevron icon animation
- Save button in header

**Step 3: Create `ContentEditor.tsx`**

Client component:
- Locale switcher tabs (BG / EN)
- Accordion per section (Hero, FAQ, Trust Bar, Gallery, TechSpecs, Performance, WhatsInBox, B2B, Footer)
- Each section renders editable fields based on content structure:
  - Text fields → `<input>` or `<textarea>`
  - FAQ → list of Q/A pairs with add/remove/reorder
  - Section visibility toggle (checkbox)
- Per-section "Save" button → UPSERT to `site_content` table
- "Publish" button at top → calls Vercel Deploy Hook URL to trigger rebuild

**Step 4: Commit** — `feat(admin): content management with text editing and section toggles`

---

### Task 11: Media management (Gallery + Hero images)

**Files:**
- Create: `src/components/admin/MediaUploader.tsx`
- Create: `src/app/api/admin/upload/route.ts`

**Step 1: Create upload API route**

- Auth check
- Accept multipart form data
- Upload to Supabase Storage `site-media` bucket
- Return public URL
- Max file size: 5MB, allowed types: webp, png, jpg

**Step 2: Create `MediaUploader.tsx`**

Client component:
- Drop zone + file input
- Image preview grid
- Drag & drop reorder (use HTML drag API — no extra deps)
- Delete button per image (with confirmation)
- Upload progress indicator

**Step 3: Integrate into ContentEditor**

- Gallery section → MediaUploader with current gallery images
- Hero section → MediaUploader for slideshow images
- Save updates image order/list in `site_content` JSONB

**Step 4: Commit** — `feat(admin): media management with upload, reorder, delete`

---

## Phase 5: Notifications & Settings

### Task 12: In-app notifications system

**Files:**
- Modify: `src/components/admin/NotificationBell.tsx` (already created in Task 3 as skeleton)
- Create: `src/app/api/admin/notifications/route.ts`

**Step 1: Create notifications API route**

GET: fetch notifications (last 20, ordered by created_at DESC)
PATCH: mark as read (single or all)

**Step 2: Complete NotificationBell implementation**

- Fetch unread count on mount
- Dropdown with last 5 notifications
- Click notification → navigate to related inquiry
- "Mark all as read" button
- Supabase realtime subscription: `supabase.channel('notifications').on('postgres_changes', ...)` for live badge updates

**Step 3: Auto-create notifications**

Modify `/api/contact/route.ts`:
- After successful inquiry insert, also INSERT into `notifications` table:
  ```typescript
  await supabase.from('notifications').insert({
    type: 'new_inquiry',
    title: 'New inquiry',
    body: `${company} (${country})`,
    inquiry_id: insertedId,
  });
  ```

**Step 4: Commit** — `feat(admin): in-app notifications with realtime updates`

---

### Task 13: Push notifications

**Files:**
- Create: `public/sw.js` (Service Worker)
- Create: `src/lib/push.ts` (push utility)
- Create: `supabase/functions/push-notify/index.ts` (Edge Function)

**Step 1: Create Service Worker `public/sw.js`**

```javascript
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'Profiline GM25', {
      body: data.body || 'New notification',
      icon: '/logo.svg',
      badge: '/logo.svg',
      data: { url: data.url || '/admin' },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
```

**Step 2: Create `src/lib/push.ts`**

Utility functions:
- `subscribeToPush()` — request permission, register SW, subscribe, save to `push_subscriptions`
- `unsubscribeFromPush()` — unsubscribe, delete from DB
- VAPID key handling (env: `NEXT_PUBLIC_VAPID_PUBLIC_KEY`)

**Step 3: Create Supabase Edge Function**

`supabase/functions/push-notify/index.ts`:
- Triggered by DB webhook on `inquiries` INSERT
- Fetches all `push_subscriptions`
- Sends web push to each endpoint using `web-push` library
- Uses VAPID keys from secrets

**Step 4: Commit** — `feat(admin): push notifications with service worker and edge function`

---

### Task 14: Settings page

**Files:**
- Create: `src/app/[locale]/admin/settings/page.tsx`
- Create: `src/components/admin/SettingsPanel.tsx`
- Create: `src/components/admin/EmailTemplateEditor.tsx`

**Step 1: Create settings page**

Server component:
- Auth check
- Fetch `admin_settings` for current user (or defaults)
- Fetch `email_templates`
- Render SettingsPanel

**Step 2: Create `SettingsPanel.tsx`**

Client component with sections:
- **Profile:** email display, "Change Password" button (uses `supabase.auth.updateUser`)
- **Notifications:** toggle switches for email_on_inquiry, push_enabled (triggers subscribe/unsubscribe), followup_reminders
- **Danger Zone:** "Export All Data (CSV)" button, "Delete Test Inquiries" button with confirmation

**Step 3: Create `EmailTemplateEditor.tsx`**

Client component:
- List of templates with Edit/Preview/Delete buttons
- "Add Template" button
- Edit mode: name, subject, body inputs with variable hints (`{{name}}`, `{{company}}`, etc.)
- Preview mode: render with sample data
- Save to `email_templates` table

**Step 4: Commit** — `feat(admin): settings page with profile, notifications, email templates`

---

## Phase 6: Integration & Landing Page

### Task 15: Connect landing page to site_content

**Files:**
- Create: `src/lib/content.ts`
- Modify: `src/app/[locale]/page.tsx`

**Step 1: Create content fetcher `src/lib/content.ts`**

```typescript
import { createAdminClient } from '@/lib/supabase/admin';

export async function getSiteContent(section: string, locale: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('site_content')
    .select('content')
    .eq('section', section)
    .eq('locale', locale)
    .single();
  return data?.content ?? null;
}
```

**Step 2: Modify landing page sections**

For each section component, add optional `content` prop:
- If `content` is provided (from DB), use it
- If `content` is null, fall back to `useTranslations()` (current behavior)
- This ensures zero downtime — site works without any DB content

**Step 3: Add Vercel Deploy Hook**

Add `VERCEL_DEPLOY_HOOK_URL` to `.env.local`. Content "Publish" button calls this URL to trigger rebuild.

**Step 4: Commit** — `feat: connect landing page to CMS content with fallback`

---

## Phase 7: Polish & Cleanup

### Task 16: Follow-up reminders (48h cron)

**Files:**
- Create: `src/app/api/cron/follow-up/route.ts`

**Step 1: Create cron endpoint**

API route that:
- Finds inquiries with status='new' and created_at < 48 hours ago
- Checks if a follow-up reminder notification already exists
- Creates notification if not
- Protected by `CRON_SECRET` header

**Step 2: Configure Vercel Cron**

Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/follow-up",
    "schedule": "0 9 * * *"
  }]
}
```

**Step 3: Commit** — `feat(admin): follow-up reminder cron job (48h)`

---

### Task 17: Final cleanup and testing

**Step 1: Remove old admin page code**

The original `/admin/page.tsx` now redirects to dashboard overview. Old `InquiriesTable` import paths may need updates.

**Step 2: Test full flow end-to-end**

Using Playwright MCP:
1. Submit inquiry from landing page
2. Check notification appears in admin
3. Open inquiry detail
4. Add note
5. Send email via composer
6. Change status
7. Verify activity timeline
8. Check analytics charts
9. Edit content in CMS
10. Verify settings save

**Step 3: Build check**

```bash
npm run build
```

**Step 4: Commit** — `feat(admin): complete admin dashboard redesign`

**Step 5: Push**

```bash
git push origin main
```
