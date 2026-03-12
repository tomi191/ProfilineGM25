# Admin Dashboard Full Redesign — Design Document

**Date:** 2026-03-13
**Approach:** Modular Admin in Next.js (Approach C)
**Status:** Approved

## Overview

Transform the current minimal admin (login + inquiries table + status dropdown) into a full-featured B2B management system with CRM, analytics, content management, and real-time notifications.

## Architecture

### Navigation
Sidebar layout replaces current flat layout:
- **Dashboard** (`/admin`) — overview stats + recent inquiries + quick actions
- **Inquiries** (`/admin/inquiries`) — full CRM list view
- **Inquiry Detail** (`/admin/inquiries/[id]`) — CRM detail page
- **Analytics** (`/admin/analytics`) — charts and statistics
- **Content** (`/admin/content`) — site content management
- **Settings** (`/admin/settings`) — profile, notifications, email templates

Header includes notification bell with unread count + dropdown.

### Tech Stack
- Next.js 16 (existing) — admin pages under `/app/[locale]/admin/*`
- Supabase — DB, Auth, Storage, Edge Functions, DB Webhooks
- Resend — transactional emails from admin
- recharts — analytics charts
- Web Push API + Service Worker — push notifications

---

## Module 1: Inquiries CRM

### List View (`/admin/inquiries`)
- Search bar (name, email, company)
- Column sorting (date, name, status)
- Bulk actions: mark as contacted, export CSV, delete
- Pagination (20 per page)
- Message tooltip on hover

### Detail View (`/admin/inquiries/[id]`)
Two-column layout:
- **Left:** Inquiry info (name, email, company, country, volume, message)
- **Right:** Activity timeline (chronological log of all actions)

Quick actions:
- Send Email (modal with templates + custom)
- Add Note
- Delete (with confirmation)

### Email Composer (Modal)
- Tabs: "Templates" | "Custom"
- Templates: Welcome, Price Quote, Need More Info, Follow-up
- Custom: free text subject + body
- Sent via Resend, logged in activity timeline

### Notes
- Free text notes per inquiry
- Timestamp + author
- Displayed in activity timeline

### New Supabase Tables
- `inquiry_notes` (id, inquiry_id, content, created_by, created_at)
- `inquiry_activity` (id, inquiry_id, type, metadata, created_by, created_at)
- `email_templates` (id, name, subject, body, locale, created_at)

---

## Module 2: Analytics

### Dashboard (`/admin/analytics`)
Period selector: Last 7d / 30d / 90d

4 charts:
1. **Inquiries over time** — line chart, daily count
2. **By Country** — horizontal bar chart, top 10
3. **Conversion Funnel** — New → Contacted → Closed with % conversion
4. **By Volume Tier** — donut chart (10-50 / 50-200 / 200+)

All data from existing `inquiries` table via SQL aggregations. No new tables needed.

Chart library: `recharts`

---

## Module 3: Content Management

### Page (`/admin/content`)
- Collapsible accordion per section (Hero, FAQ, Trust Bar, Gallery, TechSpecs, Performance, WhatsInBox, B2B, Footer)
- Language switcher (BG/EN) — edit each locale separately
- Per-section Save button (partial update)
- Section visibility toggles — show/hide entire sections without code

### Media Management
- Image upload via Supabase Storage bucket `site-media`
- Gallery: drag & drop reorder, add/remove images
- Hero slideshow: add/remove/reorder slides
- Image preview + delete with confirmation

### How Landing Page Reads Content
- At build time (SSG) → fetch from `site_content` table
- Fallback to hardcoded values from `messages/*.json` if no DB record
- "Publish" button triggers Vercel redeploy webhook for SSG rebuild

### New Supabase Resources
- `site_content` table (id, section, locale, content JSONB, updated_at, updated_by)
- Supabase Storage bucket: `site-media`

---

## Module 4: Notifications & Settings

### In-App Notifications (Header Bell)
- Dropdown with last 5 notifications + unread count badge
- Types: new inquiry, follow-up reminder (48h), status change
- Mark as read / Mark all as read
- "View all" link

### Push Notifications
- Web Push API + Service Worker
- Opt-in from Settings
- Supabase Edge Function triggers push on new inquiry insert (DB webhook)

### Settings Page (`/admin/settings`)
- Profile: email display, change password
- Notifications: toggles for email/push/follow-up reminders
- Email Templates: edit/preview/add templates
- Danger Zone: export all data CSV, delete test inquiries

### New Supabase Tables
- `notifications` (id, type, title, body, inquiry_id, read, created_at)
- `push_subscriptions` (id, user_id, endpoint, keys_p256dh, keys_auth, created_at)
- `admin_settings` (id, user_id, email_on_inquiry, push_enabled, followup_reminders)

---

## All New Supabase Tables Summary

| Table | Purpose |
|-------|---------|
| `inquiry_notes` | Notes per inquiry |
| `inquiry_activity` | Activity timeline log |
| `email_templates` | Quick reply email templates |
| `site_content` | CMS content (JSONB per section/locale) |
| `notifications` | In-app notifications |
| `push_subscriptions` | Web Push subscriptions |
| `admin_settings` | User notification preferences |
| Storage: `site-media` | Uploaded images |

---

## Estimated Scope
- ~20-25 new files
- 7 new Supabase tables + 1 Storage bucket
- 1 Supabase Edge Function (push notification trigger)
- 1 Service Worker (push receiver)
