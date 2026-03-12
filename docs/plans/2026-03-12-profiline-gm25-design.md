# Profiline GM25 Official Website — Design Document

**Date:** 2026-03-12
**Status:** Approved

---

## 1. Overview

Professional B2B landing page for the Profiline GM25 Dual Action Orbital Polisher, engineered in Bulgaria. The site targets distributors and partners across Europe, presented in Bulgarian and English.

### Goals
- Attract B2B distributors and partners across EU
- Showcase product professionally with AI-generated visuals
- Collect distributor inquiries with email notifications
- Achieve top SEO and AI discovery (GEO) scores
- Full GDPR compliance

### Non-Goals (for now)
- B2C sales or order forms
- Online payments
- Multiple languages beyond BG/EN

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, React Server Components) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion (motion/react) |
| Database | Supabase (PostgreSQL + Auth + RLS) |
| Email | Resend + React Email |
| Images | next/image (auto WebP/AVIF) |
| i18n | next-intl (server-side, /bg and /en routes) |
| Icons | Lucide React |
| Carousel | Swiper |
| Deployment | Vercel (from Git) |
| AI Photos | kie.ai (nano banana2 + image-to-video) |
| Analytics | GA4 (with Google Consent Mode v2) |
| Search Console | Google Search Console |

---

## 3. Product Specifications (Confirmed from labels & manual)

- **Model:** PROFILINE GM 25
- **Power:** 1200W
- **Voltage:** 220-240V/50Hz (EU), 110-120V/60Hz (US variant)
- **Speed:** 2200-5800 OPM (6-speed: 1=2200, 2=2900, 3=3600, 4=4300, 5=5000, 6=5800)
- **Orbit:** 25mm
- **Weight:** 2.60 kg
- **Backing plates:** 125mm (5") and 150mm (6")
- **Certifications:** CE + EAC
- **Warranty:** 2 years (all markets)
- **Domain:** profilinegm25.eu
- **Email:** contact@profilinegm25.eu
- **Brand colors:** Black (#050505), Lime (#A3E635), White (#FFFFFF)

---

## 4. File Structure

```
profiline-gm25/
├── app/
│   ├── [locale]/              # i18n routing (bg, en)
│   │   ├── layout.tsx         # root layout with metadata
│   │   ├── page.tsx           # landing page
│   │   └── admin/
│   │       ├── layout.tsx     # admin layout with auth guard
│   │       └── page.tsx       # dashboard — inquiries
│   ├── api/
│   │   ├── contact/route.ts   # B2B form → Supabase + Resend
│   │   └── auth/route.ts      # Supabase auth callbacks
│   ├── robots.ts              # dynamic robots.txt
│   ├── sitemap.ts             # dynamic sitemap.xml
│   ├── llms.txt/route.ts      # LLM-readable site info
│   └── manifest.ts            # PWA manifest
├── components/
│   ├── sections/              # Hero, TrustBar, Gallery, TechSpecs...
│   ├── ui/                    # Button, Input, Modal...
│   └── emails/                # React Email templates
├── lib/
│   ├── supabase.ts            # Supabase client
│   ├── resend.ts              # Resend client
│   └── utils.ts
├── messages/
│   ├── bg.json                # Bulgarian translations
│   └── en.json                # English translations
├── public/
│   ├── images/                # Optimized product photos
│   ├── logo.png
│   └── llms-full.txt
└── docs/
    └── plans/
```

---

## 5. Landing Page Sections

### 5.1 Navigation (Fixed Header)
- Logo left, nav links center (Product / Specs / Gallery / FAQ / Contact)
- Language switcher (BG/EN) right
- Mobile: hamburger menu
- Transparent in Hero zone, solid on scroll

### 5.2 Hero
- Fullscreen with AI-generated video loop of GM25 (kie.ai image-to-video)
- Dark overlay gradient for text readability
- Title: "Unleash Flawless Correction. Engineered in Europe."
- CTA: "Become a Distributor" → scrolls to B2B form
- Scroll indicator arrow

### 5.3 Trust Bar
5 items horizontal:
1. Engineered in Bulgaria
2. CE Certified Quality
3. 2-Year Warranty
4. EU-Wide Delivery
5. Spare Parts & Support

### 5.4 Product Gallery
- Swiper carousel with real + AI-generated product photos
- Fullscreen lightbox on click
- 6-8 images: hero shot, side view, speed dial, backing plate, box, in-action
- Lazy loading

### 5.5 Tech Specs
- Two columns: left — 4 feature cards with icons, right — large product photo
- Stats bar below: 1200W | 2.60kg | 25mm | 5" & 6" | 6-speed
- Motion animations on scroll

### 5.6 Performance (Zig-Zag)
- Block 1: Image left + text right — "Zero Vibration. Perfect Balance."
- Block 2: Text left + image right — "Unstoppable Cutting Power."
- AI-generated in-action photos

### 5.7 What's in the Box
- Visual grid showing all included components:
  - GM25 polisher
  - 125mm (5") backing plate
  - 150mm (6") backing plate
  - User manual
  - Warranty card

### 5.8 FAQ
- Accordion (expand/collapse)
- 5-6 B2B-focused questions
- Schema.org FAQPage markup for SEO

### 5.9 B2B Partner Form
- Left: "Partner with Profiline" + 3 benefits (Exclusive Territories, Marketing Support, B2B Pricing)
- Right: form (Name, Email, Company, Country, Expected Volume, Message)
- Submit → Supabase + Resend (notification to admin + confirmation to distributor)

### 5.10 Footer
- 4 columns: Brand + Social | Support | Legal | Contact
- Social: Facebook (live), Instagram (placeholder), YouTube (placeholder)
- Copyright 2026

---

## 6. Admin Panel

- URL: `/admin` (protected by Supabase Auth)
- Single admin account
- Dashboard: 3 summary cards (New / Contacted this month / Total)
- Inquiries table: Date, Name, Company, Country, Email, Volume, Status
- Filters by status (New / Contacted / Closed) and date
- Click to expand details + full message
- Status change buttons
- Dark theme matching site design

---

## 7. Email System (Resend)

### On new B2B inquiry:

**Email 1 → Admin (contact@profilinegm25.eu)**
- Subject: "New Distributor Inquiry — {Company} ({Country})"
- All form data in clean format
- Direct link to admin panel

**Email 2 → Distributor (auto-confirmation)**
- Subject: "Thank you for your inquiry — Profiline GM25"
- Branded HTML template with Profiline logo
- Summary of submitted data
- "We will respond within 48 hours"
- Sent in the language of the form submission (BG or EN)

### Technical:
- React Email for HTML templates
- Resend API called from Next.js API Route
- From: noreply@profilinegm25.eu (requires domain verification)
- Rate limiting: max 5 submissions per IP per hour

---

## 8. SEO & AI Discovery

### On-Page SEO
- Unique title + description per locale
- Open Graph + Twitter Card meta tags
- Canonical URLs + hreflang tags
- Schema.org JSON-LD: Product, Organization, FAQPage, WebSite

### AI Discovery (GEO)
- robots.txt — allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended
- llms.txt — short product summary for LLMs
- llms-full.txt — complete product specs and info
- Passage-level citability in content

### Technical SEO
- Auto-generated sitemap.xml for /bg and /en
- Dynamic robots.txt
- Core Web Vitals targets: LCP < 2.0s, INP < 150ms, CLS < 0.05
- next/image for WebP/AVIF + responsive srcset
- Inter font via next/font (self-hosted)

### Performance Targets
| Metric | Target |
|--------|--------|
| Lighthouse Performance | 95+ |
| Lighthouse SEO | 100 |
| Lighthouse Accessibility | 95+ |
| LCP | < 2.0s |
| INP | < 150ms |
| CLS | < 0.05 |
| TTFB | < 200ms |

---

## 9. Legal & GDPR

### Documents (BG + EN)
1. **Privacy Policy** — data collection, Supabase EU storage, GDPR rights
2. **Terms & Conditions** — service description, IP, liability, warranty, Bulgarian/EU law
3. **Cookie Policy** — necessary cookies, analytics (GA4 only after consent)

### Cookie Banner
- Custom design matching site theme
- Accept / Decline buttons
- GA4 loads ONLY on Accept (Google Consent Mode v2)
- Consent stored in localStorage + logged in Supabase

---

## 10. Visual Content (kie.ai)

### AI-Generated Photos (~9-10 total):
- **Hero:** Dramatic shot, dark background, lime accent lighting → convert to video loop
- **Gallery (4-5):** Studio shots from multiple angles, speed dial close-up, unboxing style
- **Performance (2):** In-action polishing, detailing studio environment
- **What's in the Box (1):** Flat lay of all components

### AI-Generated Videos (1-2):
- Hero video loop (5-10 sec) from best hero photo
- Optional second clip for performance section

### Process:
1. Install kie.ai
2. Upload real photos as reference
3. Generate each image with specific prompts
4. Select best variants
5. Optimize for web (compression, resize)
6. Best hero shot → image-to-video

---

## 11. Supabase Schema

```sql
CREATE TABLE inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  country TEXT NOT NULL,
  expected_volume TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE cookie_consents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  consent BOOLEAN NOT NULL,
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 12. External Services

| Service | Purpose | Status |
|---------|---------|--------|
| Vercel | Hosting & deployment | User has account |
| Supabase | Database + Auth | To be set up |
| Resend | Transactional emails | To be set up |
| kie.ai | AI image/video generation | API key provided |
| GA4 | Analytics | To be set up |
| GSC | Search Console | To be set up |
| Google My Business | Business profile | To be created |
| Facebook | Social media | Active |
| Instagram | Social media | To be created |
| YouTube | Social media | To be created |

---

## 13. Brand Assets

- **Logo:** profiline-logo.png (white text + lime arc, transparent background)
- **Colors:** Black (#050505), Lime (#A3E635), White (#FFFFFF)
- **Font:** Inter
- **Domain:** profilinegm25.eu
- **Facebook:** https://www.facebook.com/profile.php?id=61579498340048
