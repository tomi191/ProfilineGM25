# Profiline GM25 Website — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a production-ready B2B landing page for the Profiline GM25 polisher with Next.js 15, Supabase, Resend, full SEO, and admin panel.

**Architecture:** Next.js 15 App Router with server-side rendering, next-intl for i18n routing (/bg, /en), Supabase for data + auth, Resend for transactional emails, Vercel for deployment. All sections are React Server Components except interactive ones (forms, carousel, cookie banner).

**Tech Stack:** Next.js 15, Tailwind CSS v4, Framer Motion, Supabase, Resend, React Email, next-intl, Swiper, Lucide React

---

## Phase 0: Project Bootstrap & Git Setup

### Task 0.1: Initialize Next.js 15 project

**Files:**
- Delete: all existing files except `docs/` and `public/`
- Create: fresh Next.js 15 project in place

**Step 1: Create new Next.js 15 project**

```bash
cd C:/Users/User/Downloads/profiline-gm25-official-site
# Save docs and photos
cp -r docs /tmp/profiline-docs
# Remove old Vite project files
rm -rf src/ node_modules/ package.json package-lock.json tsconfig.json vite.config.ts index.html metadata.json .env.example README.md
# Create fresh Next.js 15 project
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --turbopack
# Restore docs
cp -r /tmp/profiline-docs/docs .
```

**Step 2: Install all dependencies**

```bash
npm install next-intl @supabase/supabase-js @supabase/ssr resend @react-email/components motion lucide-react swiper
```

**Step 3: Verify dev server starts**

```bash
npm run dev
```
Expected: Next.js dev server running on localhost:3000

**Step 4: Create .env.local template**

Create `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Resend
RESEND_API_KEY=

# kie.ai
KIE_API_KEY=

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_EMAIL=contact@profilinegm25.eu

# GA4
NEXT_PUBLIC_GA4_ID=
```

**Step 5: Update .gitignore**

Ensure `.gitignore` includes:
```
.env.local
.env*.local
node_modules/
.next/
```

**Step 6: Commit**

```bash
git add -A
git commit -m "chore: initialize Next.js 15 project with dependencies"
```

---

### Task 0.2: Configure Tailwind CSS v4 + Brand Theme

**Files:**
- Modify: `app/globals.css`
- Modify: `tailwind.config.ts` (if generated) or CSS theme

**Step 1: Set up brand theme in globals.css**

```css
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --color-lime-brand: #A3E635;
  --color-bg-primary: #050505;
  --color-bg-secondary: #0a0a0a;
  --color-bg-card: #111111;
  --color-border: #1a1a1a;
  --color-border-hover: #333333;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-bg-primary);
  color: #ffffff;
  font-family: var(--font-sans);
}

::selection {
  background-color: var(--color-lime-brand);
  color: #000000;
}
```

**Step 2: Set up Inter font in layout**

In `app/layout.tsx`, use `next/font`:
```tsx
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin', 'cyrillic'] });
```

**Step 3: Verify styles work**

```bash
npm run dev
```
Expected: Dark background, white text, Inter font

**Step 4: Commit**

```bash
git add -A
git commit -m "style: configure Tailwind v4 with Profiline brand theme"
```

---

### Task 0.3: Configure next-intl for i18n

**Files:**
- Create: `messages/en.json`
- Create: `messages/bg.json`
- Create: `i18n/request.ts`
- Create: `i18n/routing.ts`
- Create: `middleware.ts`
- Modify: `app/layout.tsx` → move to `app/[locale]/layout.tsx`
- Modify: `app/page.tsx` → move to `app/[locale]/page.tsx`

**Step 1: Create routing config**

Create `i18n/routing.ts`:
```tsx
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['bg', 'en'],
  defaultLocale: 'bg'
});
```

**Step 2: Create request config**

Create `i18n/request.ts`:
```tsx
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
```

**Step 3: Create middleware**

Create `middleware.ts`:
```tsx
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
```

**Step 4: Create translation files**

Create `messages/en.json` and `messages/bg.json` with all translations from the design doc (hero, trust, specs, performance, faq, b2b, footer, cookie, legal sections). Full translation content is in the existing `src/i18n.ts` file — extract and restructure into JSON files.

**Step 5: Set up locale layout**

Move `app/layout.tsx` to `app/[locale]/layout.tsx`:
```tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Inter } from 'next/font/google';
import '../globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

**Step 6: Create placeholder page**

Create `app/[locale]/page.tsx`:
```tsx
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

export default function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = React.use(params);
  setRequestLocale(locale);
  const t = useTranslations('hero');
  return <h1>{t('title1')}</h1>;
}
```

**Step 7: Verify both locales work**

```bash
npm run dev
```
Visit `localhost:3000/bg` and `localhost:3000/en`
Expected: Different text per locale, auto-redirect from `/` to `/bg`

**Step 8: Commit**

```bash
git add -A
git commit -m "feat: configure next-intl with BG/EN routing"
```

---

## Phase 1: Landing Page Sections

### Task 1.1: Navigation Header

**Files:**
- Create: `components/sections/Header.tsx`
- Create: `components/ui/LanguageSwitcher.tsx`
- Create: `components/ui/MobileMenu.tsx`
- Modify: `app/[locale]/layout.tsx` — add Header

**Implementation:**
- Fixed header with transparent → solid background on scroll (using `useEffect` + scroll listener)
- Logo (next/image from public/logo.png) left
- Nav links center: Product, Specs, Gallery, FAQ, Contact (smooth scroll to section IDs)
- LanguageSwitcher right (BG/EN toggle using next-intl `useRouter`)
- Mobile: hamburger icon → slide-out menu with AnimatePresence
- Mark as `"use client"` component for scroll detection

**Commit:** `feat: add navigation header with language switcher`

---

### Task 1.2: Hero Section

**Files:**
- Create: `components/sections/Hero.tsx`

**Implementation:**
- Fullscreen section (`h-screen`) with video background
- For now: use placeholder dark gradient until AI video is generated
- Overlay gradient for text readability
- Animated text entry with Framer Motion (fade up)
- Subtitle: "Profiline GM25 Dual Action Polisher"
- Title: translated hero.title1 + hero.title2
- Description paragraph
- CTA button: "Become a Distributor" → smooth scroll to `#b2b-section`
- Scroll indicator (animated chevron down)
- Uses `useTranslations('hero')`

**Commit:** `feat: add Hero section with CTA and animations`

---

### Task 1.3: Trust Bar

**Files:**
- Create: `components/sections/TrustBar.tsx`

**Implementation:**
- 5 trust items in horizontal grid (`grid-cols-2 md:grid-cols-5`)
- Each: Lucide icon + text + tooltip on hover
- Items: Settings (Bulgaria), Award (CE), ShieldCheck (Warranty), Truck (Delivery), Wrench (Spare Parts)
- Tooltips with CSS hover (no JS needed)
- Border top/bottom separator

**Commit:** `feat: add Trust Bar with 5 trust signals`

---

### Task 1.4: Product Gallery

**Files:**
- Create: `components/sections/Gallery.tsx`
- Create: `components/ui/Lightbox.tsx`

**Implementation:**
- Swiper carousel with real product photos (copy from профилина folder to public/images/)
- For now: use the best real photos, replace with AI-generated later
- Fullscreen lightbox modal on click (AnimatePresence + motion.div)
- Lazy loading with next/image
- Pagination dots + navigation arrows
- `"use client"` component for Swiper

**Commit:** `feat: add Product Gallery with Swiper carousel and lightbox`

---

### Task 1.5: Tech Specs

**Files:**
- Create: `components/sections/TechSpecs.tsx`

**Implementation:**
- Section title + description
- Two-column layout: left — 4 feature cards (icon + title + desc), right — large product image
- Feature cards: Zap (1200W Motor), Activity (25mm Throw), Wind (Cooling), Settings (6-Speed)
- Stats bar below: 4 metrics in grid with motion animations (1200W, 2.60kg, 25mm, 5" & 6")
- Framer Motion whileInView animations

**Commit:** `feat: add Tech Specs section with feature cards and stats`

---

### Task 1.6: Performance Zig-Zag

**Files:**
- Create: `components/sections/Performance.tsx`

**Implementation:**
- Block 1: Image left + text right — "Zero Vibration. Perfect Balance."
  - Bullet list: rubberized grip, progressive trigger, 9m cable
- Block 2: Text left + image right — "Unstoppable Cutting Power."
  - Description of 25mm throw + rotation maintenance
- Use real product photos for now
- Framer Motion scroll animations
- Responsive: stack vertically on mobile

**Commit:** `feat: add Performance zig-zag sections`

---

### Task 1.7: What's in the Box

**Files:**
- Create: `components/sections/WhatsInBox.tsx`

**Implementation:**
- Section title
- Grid of 5 items (responsive: 2 cols mobile, 5 cols desktop)
- Each item: icon/placeholder image + label
- Items: GM25 Polisher, 125mm Plate, 150mm Plate, User Manual, Warranty Card
- Clean minimal design, dark cards with border

**Commit:** `feat: add What's in the Box section`

---

### Task 1.8: FAQ Accordion

**Files:**
- Create: `components/sections/FAQ.tsx`

**Implementation:**
- Section title
- Accordion items with expand/collapse (useState + AnimatePresence)
- 6 questions (B2B focused): warranty, backing plates, beginner suitability, orbital throw, becoming distributor, spare parts
- ChevronDown icon rotates on open
- `"use client"` for interactivity

**Commit:** `feat: add FAQ accordion section`

---

### Task 1.9: B2B Partner Form

**Files:**
- Create: `components/sections/B2BForm.tsx`

**Implementation:**
- Two columns: left info + right form
- Left: title, description, 3 numbered benefits (Exclusive Territories, Marketing Support, B2B Pricing)
- Right: form with fields (Name, Email, Company, Country, Expected Volume dropdown, Message)
- Form state management with useState
- Submit handler: POST to `/api/contact`
- States: idle, submitting (spinner), success (checkmark animation), error
- Email field added (missing from old version!)
- Section ID: `b2b-section`
- `"use client"` component

**Commit:** `feat: add B2B partner form with submission handling`

---

### Task 1.10: Footer

**Files:**
- Create: `components/sections/Footer.tsx`
- Create: `components/ui/LegalModal.tsx`

**Implementation:**
- 4 columns: Brand + Social | Support links | Legal links | Contact info
- Brand: PROFILINE logo + description + social icons (Facebook real link, Instagram/YouTube placeholder)
- Support: User Manual, Warranty Claim, Spare Parts, Contact
- Legal: Terms, Privacy Policy, Cookie Policy → open LegalModal
- Contact: email, website
- Bottom bar: copyright + SSL/CE badges
- LegalModal: AnimatePresence modal with close button, scrollable content

**Commit:** `feat: add Footer with legal modals and social links`

---

### Task 1.11: Cookie Banner

**Files:**
- Create: `components/ui/CookieBanner.tsx`

**Implementation:**
- Fixed bottom banner with AnimatePresence
- Text + Accept/Decline buttons
- Accept → localStorage + Supabase log + load GA4
- Decline → localStorage + Supabase log + don't load GA4
- Google Consent Mode v2 integration
- Shows after 1.5s delay on first visit
- `"use client"` component

**Commit:** `feat: add GDPR cookie banner with consent management`

---

### Task 1.12: Assemble Landing Page

**Files:**
- Modify: `app/[locale]/page.tsx`
- Modify: `app/[locale]/layout.tsx`

**Implementation:**
- Import and compose all sections in order:
  Header → Hero → TrustBar → Gallery → TechSpecs → Performance → WhatsInBox → FAQ → B2BForm → Footer → CookieBanner
- Add metadata export with SEO tags

**Commit:** `feat: assemble complete landing page`

---

## Phase 2: Backend & Integrations

### Task 2.1: Supabase Setup

**Files:**
- Create: `lib/supabase/client.ts` (browser client)
- Create: `lib/supabase/server.ts` (server client)

**Step 1: User creates Supabase project and provides credentials**

User adds to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

**Step 2: Create Supabase clients**

Browser client using `@supabase/ssr` `createBrowserClient`.
Server client using `@supabase/ssr` `createServerClient` with cookie handling.

**Step 3: Run SQL to create tables**

Execute in Supabase SQL Editor:
```sql
CREATE TABLE inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  country TEXT NOT NULL,
  expected_volume TEXT,
  message TEXT,
  locale TEXT DEFAULT 'en',
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can read all inquiries"
  ON inquiries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert inquiries"
  ON inquiries FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Admin can update inquiries"
  ON inquiries FOR UPDATE
  TO authenticated
  USING (true);

CREATE TABLE cookie_consents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  consent BOOLEAN NOT NULL,
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE cookie_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert consent"
  ON cookie_consents FOR INSERT
  TO anon
  WITH CHECK (true);
```

**Step 4: Create admin user in Supabase Auth dashboard**

**Step 5: Verify connection**

```bash
npm run dev
```
Test Supabase client imports without errors.

**Commit:** `feat: configure Supabase clients and database schema`

---

### Task 2.2: Contact API Route + Resend

**Files:**
- Create: `app/api/contact/route.ts`
- Create: `lib/resend.ts`
- Create: `components/emails/AdminNotification.tsx`
- Create: `components/emails/DistributorConfirmation.tsx`

**Step 1: User sets up Resend**

- Create Resend account
- Verify domain profilinegm25.eu
- Get API key → `.env.local`

**Step 2: Create Resend client**

`lib/resend.ts`:
```tsx
import { Resend } from 'resend';
export const resend = new Resend(process.env.RESEND_API_KEY);
```

**Step 3: Create email templates**

AdminNotification: clean HTML with all form data + link to admin panel.
DistributorConfirmation: branded template with logo, summary, "48 hours" promise. Two variants (BG/EN) based on locale field.

**Step 4: Create API route**

`app/api/contact/route.ts`:
- Validate input (name, email, company, country required)
- Rate limit: check IP, max 5/hour (using simple in-memory Map or Supabase check)
- Insert into Supabase `inquiries` table
- Send admin notification email
- Send distributor confirmation email (in correct locale)
- Return JSON response

**Step 5: Connect B2BForm component to API**

Update form submit handler to POST to `/api/contact`.

**Step 6: Test end-to-end**

Submit form → check Supabase → check emails

**Commit:** `feat: add contact API with Supabase + Resend integration`

---

### Task 2.3: Admin Panel

**Files:**
- Create: `app/[locale]/admin/layout.tsx`
- Create: `app/[locale]/admin/page.tsx`
- Create: `app/[locale]/admin/login/page.tsx`
- Create: `components/admin/InquiriesTable.tsx`
- Create: `components/admin/StatsCards.tsx`
- Create: `components/admin/StatusBadge.tsx`

**Step 1: Create login page**

Simple login form with email + password → Supabase Auth `signInWithPassword`.

**Step 2: Create admin layout with auth guard**

Check Supabase session in layout. No session → redirect to login.

**Step 3: Create dashboard page**

- Fetch all inquiries from Supabase (server component)
- StatsCards: New count, Contacted this month, Total
- InquiriesTable: sortable table with all columns
- Click row → expand to show full message
- Status dropdown to change (New → Contacted → Closed)
- Filter buttons by status

**Step 4: Test admin flow**

Login → see dashboard → change status → verify in Supabase

**Commit:** `feat: add admin panel with inquiries dashboard`

---

## Phase 3: SEO & AI Discovery

### Task 3.1: Metadata & Schema.org

**Files:**
- Modify: `app/[locale]/layout.tsx` — add metadata
- Create: `components/seo/JsonLd.tsx`

**Implementation:**
- Dynamic metadata per locale (title, description, OG tags, Twitter cards)
- Canonical URLs with hreflang alternates
- JSON-LD components: Product, Organization, FAQPage, WebSite
- OG image (product hero shot)

**Commit:** `feat: add SEO metadata, OG tags, and Schema.org JSON-LD`

---

### Task 3.2: robots.txt, sitemap.xml, llms.txt

**Files:**
- Create: `app/robots.ts`
- Create: `app/sitemap.ts`
- Create: `app/llms.txt/route.ts`
- Create: `public/llms-full.txt`

**Implementation:**

robots.ts:
```tsx
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
    ],
    sitemap: 'https://profilinegm25.eu/sitemap.xml',
  };
}
```

sitemap.ts: generates entries for /bg and /en with lastmod.

llms.txt route: returns plain text with product summary.

llms-full.txt: complete product info, specs, warranty, contact.

**Commit:** `feat: add robots.txt, sitemap.xml, llms.txt for SEO and AI discovery`

---

### Task 3.3: Google Analytics 4 + Consent Mode v2

**Files:**
- Create: `components/seo/GoogleAnalytics.tsx`
- Modify: `components/ui/CookieBanner.tsx` — integrate consent signals

**Implementation:**
- GA4 script loaded conditionally based on cookie consent
- Google Consent Mode v2: default deny → grant on accept
- `gtag('consent', 'default', { analytics_storage: 'denied' })`
- On accept: `gtag('consent', 'update', { analytics_storage: 'granted' })`

**Commit:** `feat: add GA4 with Google Consent Mode v2`

---

## Phase 4: Legal Documents

### Task 4.1: Privacy Policy, Terms & Conditions, Cookie Policy

**Files:**
- Add to: `messages/en.json` — legal section translations
- Add to: `messages/bg.json` — legal section translations
- Modify: `components/ui/LegalModal.tsx` — render real content

**Implementation:**
- Write comprehensive legal texts in BG and EN
- Privacy Policy: GDPR compliant, covers data collection, Supabase storage, user rights
- Terms & Conditions: service description, IP, liability, warranty (2yr), Bulgarian/EU law
- Cookie Policy: necessary + analytics cookies, opt-out instructions
- Render in LegalModal with proper formatting (headings, paragraphs, lists)

**Commit:** `feat: add GDPR-compliant legal documents in BG and EN`

---

## Phase 5: Visual Content (kie.ai)

### Task 5.1: Generate AI Product Photos

**Process (manual with user):**
1. Install kie.ai CLI or use API
2. Upload best real photos as reference (side view, front, with box)
3. Generate with specific prompts:
   - Hero: "Professional product photo of orbital polisher, dramatic dark background, lime green accent lighting, studio quality, 8k"
   - Studio: "Clean studio product photo, dark gray background, professional lighting, multiple angles"
   - In-action: "Professional detailer polishing dark car hood with orbital polisher, detailing studio, professional lighting"
   - Flat lay: "Product unboxing flat lay, dark surface, orbital polisher with accessories, minimal style"
4. Select best variants
5. Optimize: resize to max 2000px wide, compress with quality 85
6. Save to `public/images/`
7. Generate hero video loop from best hero shot

### Task 5.2: Replace placeholder images

**Files:**
- Modify: all section components that reference images

**Implementation:**
- Replace all Unsplash URLs and placeholder images with optimized AI photos
- Use next/image with proper width/height/alt attributes
- Hero video: replace stock video with AI-generated loop

**Commit:** `feat: add AI-generated product photos and hero video`

---

## Phase 6: Copy Product Photos to Project

### Task 6.1: Prepare real product photos

**Files:**
- Create: `public/images/product/` directory

**Step 1: Copy and rename real photos**

```bash
mkdir -p public/images/product
cp "C:/Users/User/Downloads/профилина/viber_изображение_2026-03-12_10-29-52-897.jpg" public/images/product/gm25-side-view.jpg
cp "C:/Users/User/Downloads/профилина/viber_изображение_2026-03-12_10-29-52-920.jpg" public/images/product/gm25-backing-plate-front.jpg
cp "C:/Users/User/Downloads/профилина/viber_изображение_2026-03-12_10-29-53-155.jpg" public/images/product/gm25-speed-dial.jpg
cp "C:/Users/User/Downloads/профилина/viber_изображение_2026-03-12_10-29-53-235.jpg" public/images/product/gm25-rear-view.jpg
cp "C:/Users/User/Downloads/профилина/viber_изображение_2026-03-12_10-29-55-621.jpg" public/images/product/gm25-specs-label.jpg
cp "C:/Users/User/Downloads/профилина/viber_изображение_2026-03-12_10-29-55-730.jpg" public/images/product/gm25-backing-plate-top.jpg
cp "C:/Users/User/Downloads/профилина/viber_изображение_2026-03-12_10-29-55-763.jpg" public/images/product/gm25-with-box.jpg
cp "C:/Users/User/Downloads/профилина/viber_изображение_2026-03-12_10-29-55-798.jpg" public/images/product/gm25-with-box-alt.jpg
cp "C:/Users/User/Downloads/профилина/viber_изображение_2026-03-12_10-29-55-823.jpg" public/images/product/gm25-logo-closeup.jpg
cp "C:/Users/User/Downloads/профилина/viber_изображение_2026-03-12_10-29-55-690.jpg" public/images/product/gm25-box-info.jpg
cp "C:/Users/User/Downloads/профилина/viber_изображение_2026-03-12_10-59-45-115.jpg" public/images/product/gm25-motor-internals.jpg
cp "C:/Users/User/Downloads/профилина/profiline-logo.png" public/images/logo.png
```

**Commit:** `feat: add real product photos and logo`

---

## Phase 7: Final Polish & Deployment

### Task 7.1: Responsive Testing

- Test all sections on mobile (375px), tablet (768px), desktop (1440px)
- Fix any layout issues
- Verify hamburger menu works on mobile
- Verify lightbox works on touch devices

**Commit:** `fix: responsive layout adjustments`

---

### Task 7.2: Performance Optimization

- Run Lighthouse audit
- Optimize any images that are too large
- Add `loading="lazy"` to below-fold images
- Add `priority` to hero image/video
- Verify Core Web Vitals meet targets
- Add `preconnect` for external domains

**Commit:** `perf: optimize images and Core Web Vitals`

---

### Task 7.3: Deploy to Vercel

**Step 1: User connects Git repo to Vercel**

**Step 2: Set environment variables in Vercel dashboard**

All variables from `.env.local` must be set in Vercel project settings.

**Step 3: Deploy**

```bash
git push origin main
```
Vercel auto-deploys on push.

**Step 4: Verify production**

- Visit profilinegm25.eu
- Test both /bg and /en
- Submit test B2B form
- Check admin panel
- Run Lighthouse on production URL

**Step 5: Set up custom domain in Vercel**

Point profilinegm25.eu DNS to Vercel.

---

### Task 7.4: Google Services Setup

**Manual steps with user:**
1. Google Search Console: verify profilinegm25.eu ownership, submit sitemap
2. GA4: create property, get Measurement ID → NEXT_PUBLIC_GA4_ID
3. Google My Business: create business profile for Profiline Tools

---

## Execution Order Summary

| Phase | Tasks | Dependencies |
|-------|-------|-------------|
| 0 | Bootstrap, Tailwind, i18n | None |
| 1 | All landing page sections | Phase 0 |
| 2 | Supabase, API, Admin | Phase 1 (for form connection) |
| 3 | SEO, robots, sitemap, GA4 | Phase 1 |
| 4 | Legal documents | Phase 1 |
| 5 | AI photos (kie.ai) | Phase 1 (needs sections built) |
| 6 | Copy real photos | Phase 0 |
| 7 | Polish, deploy | All phases |

**Phases 1-4 and 6 can run in parallel after Phase 0 is complete.**
