'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  ChevronDown,
  ChevronUp,
  Save,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Globe,
} from 'lucide-react';

/* ---------- Types ---------- */

interface SiteContentRow {
  id: string;
  section: string;
  locale: string;
  content: Record<string, unknown>;
  updated_at: string;
}

interface Props {
  siteContent: SiteContentRow[];
  defaults: { bg: Record<string, unknown>; en: Record<string, unknown> };
  locale: string;
}

/* ---------- Section definitions ---------- */

const sections = [
  {
    key: 'hero',
    label: 'Hero Section',
    fields: ['subtitle', 'title1', 'title2', 'desc', 'cta'],
  },
  {
    key: 'trustBar',
    label: 'Trust Bar',
    fields: [
      'item1Title',
      'item1Desc',
      'item2Title',
      'item2Desc',
      'item3Title',
      'item3Desc',
      'item4Title',
      'item4Desc',
      'item5Title',
      'item5Desc',
    ],
  },
  { key: 'gallery', label: 'Gallery', fields: ['title', 'subtitle'] },
  { key: 'techSpecs', label: 'Tech Specs', fields: ['title', 'subtitle'] },
  {
    key: 'performance',
    label: 'Performance',
    fields: ['title', 'subtitle'],
  },
  { key: 'whatsInBox', label: "What's in the Box", fields: ['title'] },
  { key: 'faq', label: 'FAQ', fields: [] },
  { key: 'b2b', label: 'B2B Section', fields: ['title', 'subtitle'] },
  { key: 'footer', label: 'Footer', fields: ['description'] },
];

/* Map JSON file section keys to our section keys */
const defaultKeyMap: Record<string, string> = {
  hero: 'hero',
  trustBar: 'trust',
  gallery: 'gallery',
  techSpecs: 'specs',
  performance: 'performance',
  whatsInBox: 'box',
  faq: 'faq',
  b2b: 'b2b',
  footer: 'footer',
};

/* Fields that should use a textarea instead of an input */
const longFields = new Set([
  'desc',
  'subtitle',
  'description',
  'cta',
  'item1Desc',
  'item2Desc',
  'item3Desc',
  'item4Desc',
  'item5Desc',
]);

/* ---------- Helpers ---------- */

function getDefaultContent(
  sectionKey: string,
  loc: string,
  defaults: Props['defaults'],
): Record<string, unknown> {
  const localeDefaults = loc === 'bg' ? defaults.bg : defaults.en;
  const mappedKey = defaultKeyMap[sectionKey] ?? sectionKey;
  const sectionDefaults = localeDefaults[mappedKey];
  if (sectionDefaults && typeof sectionDefaults === 'object') {
    return { ...(sectionDefaults as Record<string, unknown>) };
  }
  return {};
}

function getDbContent(
  sectionKey: string,
  loc: string,
  siteContent: SiteContentRow[],
): Record<string, unknown> | null {
  const row = siteContent.find(
    (r) => r.section === sectionKey && r.locale === loc,
  );
  return row ? { ...row.content } : null;
}

/* ---------- Component ---------- */

export default function ContentEditor({
  siteContent,
  defaults,
  locale,
}: Props) {
  const [activeLocale, setActiveLocale] = useState<'bg' | 'en'>(
    locale === 'bg' ? 'bg' : 'en',
  );
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [editedContent, setEditedContent] = useState<
    Record<string, Record<string, unknown>>
  >({});
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Visibility state
  const visibilityRow = siteContent.find(
    (r) => r.section === '_visibility' && r.locale === activeLocale,
  );
  const [visibility, setVisibility] = useState<Record<string, boolean>>(() => {
    const visDefaults: Record<string, boolean> = {};
    sections.forEach((s) => {
      visDefaults[s.key] = true;
    });
    if (visibilityRow && typeof visibilityRow.content === 'object') {
      return { ...visDefaults, ...(visibilityRow.content as Record<string, boolean>) };
    }
    return visDefaults;
  });
  const [savingVisibility, setSavingVisibility] = useState(false);

  const supabase = createClient();

  const toggleSection = useCallback((key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  /* Get content for a section: edited > DB > defaults */
  const getContent = useCallback(
    (sectionKey: string): Record<string, unknown> => {
      const cacheKey = `${sectionKey}_${activeLocale}`;
      if (editedContent[cacheKey]) return editedContent[cacheKey];
      const db = getDbContent(sectionKey, activeLocale, siteContent);
      if (db) return db;
      return getDefaultContent(sectionKey, activeLocale, defaults);
    },
    [activeLocale, editedContent, siteContent, defaults],
  );

  /* Update a field value */
  const updateField = useCallback(
    (sectionKey: string, field: string, value: string) => {
      const cacheKey = `${sectionKey}_${activeLocale}`;
      setEditedContent((prev) => {
        const existing = prev[cacheKey] ?? getContent(sectionKey);
        return { ...prev, [cacheKey]: { ...existing, [field]: value } };
      });
    },
    [activeLocale, getContent],
  );

  /* Save a section to Supabase */
  const saveSection = useCallback(
    async (sectionKey: string) => {
      setSavingSection(sectionKey);
      setSaveSuccess(null);
      const cacheKey = `${sectionKey}_${activeLocale}`;
      const content = editedContent[cacheKey] ?? getContent(sectionKey);

      const { error } = await supabase.from('site_content').upsert(
        {
          section: sectionKey,
          locale: activeLocale,
          content,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'section,locale' },
      );

      setSavingSection(null);
      if (error) {
        alert(`Error saving ${sectionKey}: ${error.message}`);
      } else {
        setSaveSuccess(sectionKey);
        setTimeout(() => setSaveSuccess(null), 2000);
      }
    },
    [activeLocale, editedContent, getContent, supabase],
  );

  /* Save visibility */
  const saveVisibility = useCallback(async () => {
    setSavingVisibility(true);
    const { error } = await supabase.from('site_content').upsert(
      {
        section: '_visibility',
        locale: activeLocale,
        content: visibility,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'section,locale' },
    );
    setSavingVisibility(false);
    if (error) {
      alert(`Error saving visibility: ${error.message}`);
    } else {
      setSaveSuccess('_visibility');
      setTimeout(() => setSaveSuccess(null), 2000);
    }
  }, [activeLocale, visibility, supabase]);

  /* FAQ helpers */
  const getFaqPairs = useCallback(
    (content: Record<string, unknown>): { q: string; a: string }[] => {
      const pairs: { q: string; a: string }[] = [];
      let i = 1;
      while (content[`q${i}`] !== undefined || content[`a${i}`] !== undefined) {
        pairs.push({
          q: String(content[`q${i}`] ?? ''),
          a: String(content[`a${i}`] ?? ''),
        });
        i++;
      }
      if (pairs.length === 0) {
        // Check if there's a title but no pairs — return empty array
        return [];
      }
      return pairs;
    },
    [],
  );

  const addFaqPair = useCallback(
    (sectionKey: string) => {
      const cacheKey = `${sectionKey}_${activeLocale}`;
      const content = { ...(editedContent[cacheKey] ?? getContent(sectionKey)) };
      const pairs = getFaqPairs(content);
      const nextIdx = pairs.length + 1;
      content[`q${nextIdx}`] = '';
      content[`a${nextIdx}`] = '';
      setEditedContent((prev) => ({ ...prev, [cacheKey]: content }));
    },
    [activeLocale, editedContent, getContent, getFaqPairs],
  );

  const removeFaqPair = useCallback(
    (sectionKey: string, index: number) => {
      const cacheKey = `${sectionKey}_${activeLocale}`;
      const content = { ...(editedContent[cacheKey] ?? getContent(sectionKey)) };
      const pairs = getFaqPairs(content);
      pairs.splice(index, 1);
      // Rebuild content with sequential keys
      const newContent: Record<string, unknown> = {};
      // Keep non-q/a fields (like title)
      Object.keys(content).forEach((k) => {
        if (!k.match(/^[qa]\d+$/)) {
          newContent[k] = content[k];
        }
      });
      pairs.forEach((pair, i) => {
        newContent[`q${i + 1}`] = pair.q;
        newContent[`a${i + 1}`] = pair.a;
      });
      setEditedContent((prev) => ({ ...prev, [cacheKey]: newContent }));
    },
    [activeLocale, editedContent, getContent, getFaqPairs],
  );

  /* Switch locale and clear edited cache */
  const switchLocale = useCallback((loc: 'bg' | 'en') => {
    setActiveLocale(loc);
    setEditedContent({});
    setSaveSuccess(null);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Content Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Edit website text content for each locale.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Locale switcher */}
          <div className="flex items-center gap-1 rounded-lg border border-[#333] bg-[#111] p-1">
            <Globe className="ml-2 h-4 w-4 text-gray-500" />
            <button
              onClick={() => switchLocale('bg')}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                activeLocale === 'bg'
                  ? 'bg-lime-500/15 text-lime-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              BG
            </button>
            <button
              onClick={() => switchLocale('en')}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                activeLocale === 'en'
                  ? 'bg-lime-500/15 text-lime-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          {/* Publish button */}
          <button
            onClick={() => alert('Deploy webhook not configured')}
            className="rounded-lg border border-lime-400/50 px-4 py-2 text-sm font-medium text-lime-400 transition-colors hover:border-lime-400 hover:bg-lime-500/10"
          >
            Publish
          </button>
        </div>
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-4">
        {sections.map((section) => {
          const isOpen = openSections[section.key] ?? false;
          const content = getContent(section.key);
          const isFaq = section.key === 'faq';
          const faqPairs = isFaq ? getFaqPairs(content) : [];

          return (
            <div
              key={section.key}
              className="rounded-2xl border border-[#333] bg-[#111] overflow-hidden"
            >
              {/* Section header */}
              <button
                type="button"
                onClick={() => toggleSection(section.key)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base font-semibold text-white">
                    {section.label}
                  </span>
                  {saveSuccess === section.key && (
                    <span className="text-xs text-lime-400">Saved!</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      saveSection(section.key);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.stopPropagation();
                        saveSection(section.key);
                      }
                    }}
                    className="flex items-center gap-1.5 rounded-lg border border-[#333] bg-[#222] px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-[#333] hover:text-white"
                  >
                    <Save className="h-3.5 w-3.5" />
                    {savingSection === section.key ? 'Saving...' : 'Save'}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Collapsible content */}
              {isOpen && (
                <div className="border-t border-[#222] px-6 py-5">
                  {/* Regular fields */}
                  {section.fields.length > 0 && (
                    <div className="flex flex-col gap-4">
                      {section.fields.map((field) => {
                        const value = String(content[field] ?? '');
                        const isLong = longFields.has(field);

                        return (
                          <div key={field} className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                              {field}
                            </label>
                            {isLong ? (
                              <textarea
                                value={value}
                                onChange={(e) =>
                                  updateField(
                                    section.key,
                                    field,
                                    e.target.value,
                                  )
                                }
                                rows={3}
                                className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/25"
                              />
                            ) : (
                              <input
                                type="text"
                                value={value}
                                onChange={(e) =>
                                  updateField(
                                    section.key,
                                    field,
                                    e.target.value,
                                  )
                                }
                                className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/25"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* FAQ: title field + dynamic Q/A pairs */}
                  {isFaq && (
                    <div className="flex flex-col gap-4">
                      {/* FAQ title */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                          title
                        </label>
                        <input
                          type="text"
                          value={String(content['title'] ?? '')}
                          onChange={(e) =>
                            updateField('faq', 'title', e.target.value)
                          }
                          className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/25"
                        />
                      </div>

                      {/* Q/A pairs */}
                      {faqPairs.map((pair, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg border border-[#222] bg-[#0a0a0a] p-4"
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-500">
                              Q&A #{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFaqPair('faq', idx)}
                              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-red-400 transition-colors hover:bg-red-500/10"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Remove
                            </button>
                          </div>
                          <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                                Question
                              </label>
                              <input
                                type="text"
                                value={pair.q}
                                onChange={(e) =>
                                  updateField(
                                    'faq',
                                    `q${idx + 1}`,
                                    e.target.value,
                                  )
                                }
                                className="w-full rounded-lg border border-[#333] bg-[#111] px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/25"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                                Answer
                              </label>
                              <textarea
                                value={pair.a}
                                onChange={(e) =>
                                  updateField(
                                    'faq',
                                    `a${idx + 1}`,
                                    e.target.value,
                                  )
                                }
                                rows={2}
                                className="w-full rounded-lg border border-[#333] bg-[#111] px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/25"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => addFaqPair('faq')}
                        className="flex items-center gap-2 self-start rounded-lg border border-dashed border-[#333] px-4 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:border-lime-400/50 hover:text-lime-400"
                      >
                        <Plus className="h-4 w-4" />
                        Add Q&A Pair
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Section Visibility Toggles */}
      <div className="rounded-2xl border border-[#333] bg-[#111] p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-lime-400" />
            <h2 className="text-lg font-semibold text-white">
              Section Visibility
            </h2>
          </div>
          <button
            onClick={saveVisibility}
            className="flex items-center gap-1.5 rounded-lg border border-[#333] bg-[#222] px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-[#333] hover:text-white"
          >
            <Save className="h-3.5 w-3.5" />
            {savingVisibility ? 'Saving...' : 'Save Visibility'}
          </button>
        </div>
        {saveSuccess === '_visibility' && (
          <p className="mb-3 text-xs text-lime-400">Visibility saved!</p>
        )}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {sections.map((section) => {
            const isVisible = visibility[section.key] ?? true;
            return (
              <label
                key={section.key}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#222] bg-[#0a0a0a] px-4 py-3 transition-colors hover:border-[#333]"
              >
                <input
                  type="checkbox"
                  checked={isVisible}
                  onChange={(e) =>
                    setVisibility((prev) => ({
                      ...prev,
                      [section.key]: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-[#333] bg-[#111] text-lime-400 accent-lime-400"
                />
                <div className="flex items-center gap-1.5">
                  {isVisible ? (
                    <Eye className="h-3.5 w-3.5 text-lime-400" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5 text-gray-500" />
                  )}
                  <span
                    className={`text-sm font-medium ${isVisible ? 'text-white' : 'text-gray-500'}`}
                  >
                    {section.label}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
