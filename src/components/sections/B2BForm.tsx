'use client';

import {useState, FormEvent} from 'react';
import {useTranslations, useLocale} from 'next-intl';
import {motion} from 'motion/react';
import {CheckCircle2, AlertCircle, Loader2} from 'lucide-react';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const benefits = [
  {num: 1, titleKey: 'point1Title', descKey: 'point1Desc'},
  {num: 2, titleKey: 'point2Title', descKey: 'point2Desc'},
  {num: 3, titleKey: 'point3Title', descKey: 'point3Desc'},
] as const;

const inputClasses =
  'w-full bg-[#111] border border-[#222] focus:border-lime-400 focus:ring-1 focus:ring-lime-400 outline-none px-4 py-3 text-white rounded-lg transition-colors';

/* Map CMS field names to translation keys where they differ */
const cmsKeyMap: Record<string, string> = {
  desc: 'subtitle',
};

interface B2BFormProps {
  cms?: Record<string, unknown>;
}

export default function B2BForm({cms}: B2BFormProps) {
  const t = useTranslations('b2b');
  const c = (key: string) => {
    const cmsField = cmsKeyMap[key] ?? key;
    if (cms && cms[cmsField] !== undefined) return String(cms[cmsField]);
    return t(key);
  };
  const locale = useLocale();
  const [status, setStatus] = useState<FormStatus>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      company: formData.get('company'),
      country: formData.get('country'),
      expected_volume: formData.get('expected_volume'),
      message: formData.get('message'),
      locale,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed');

      setStatus('success');
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  }

  return (
    <section
      id="b2b-section"
      className="bg-[#0a0a0a] py-24 border-t border-[#1a1a1a] scroll-mt-20"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid md:grid-cols-2 gap-16">
          {/* LEFT — info */}
          <motion.div
            initial={{opacity: 0, x: -30}}
            whileInView={{opacity: 1, x: 0}}
            viewport={{once: true, margin: '-100px'}}
            transition={{duration: 0.6}}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{c('title')}</h2>
            <p className="text-gray-400 text-lg mb-10">{c('desc')}</p>

            <div className="space-y-8">
              {benefits.map((b) => (
                <div key={b.num} className="flex gap-4">
                  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-[#111] border border-[#222] rounded-full">
                    <span className="text-lime-400 font-bold">{b.num}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{t(b.titleKey)}</h4>
                    <p className="text-gray-400 text-sm mt-1">{t(b.descKey)}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — form */}
          <motion.div
            initial={{opacity: 0, x: 30}}
            whileInView={{opacity: 1, x: 0}}
            viewport={{once: true, margin: '-100px'}}
            transition={{duration: 0.6, delay: 0.1}}
            className="relative"
          >
            <div className="bg-[#050505] border border-[#1a1a1a] rounded-2xl p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Row 1: Name + Email */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      {t('formName')}
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className={inputClasses}
                      disabled={status === 'submitting' || status === 'success'}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      {t('formEmail')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className={inputClasses}
                      disabled={status === 'submitting' || status === 'success'}
                    />
                  </div>
                </div>

                {/* Row 2: Company + Country */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      {t('formCompany')}
                    </label>
                    <input
                      type="text"
                      name="company"
                      required
                      className={inputClasses}
                      disabled={status === 'submitting' || status === 'success'}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      {t('formCountry')}
                    </label>
                    <input
                      type="text"
                      name="country"
                      required
                      className={inputClasses}
                      disabled={status === 'submitting' || status === 'success'}
                    />
                  </div>
                </div>

                {/* Row 3: Expected Volume */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    {t('formVolume')}
                  </label>
                  <select
                    name="expected_volume"
                    className={`${inputClasses} appearance-none`}
                    disabled={status === 'submitting' || status === 'success'}
                  >
                    <option value="">{t('formVolumeSelect')}</option>
                    <option value="10-50">10-50 units/mo</option>
                    <option value="50-200">50-200 units/mo</option>
                    <option value="200+">200+ units/mo</option>
                  </select>
                </div>

                {/* Row 4: Message */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    {t('formMessage')}
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    placeholder={t('formMessagePlaceholder')}
                    className={`${inputClasses} resize-none`}
                    disabled={status === 'submitting' || status === 'success'}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === 'submitting' || status === 'success'}
                  className="w-full border border-lime-400/60 text-lime-400 font-bold py-4 rounded-lg uppercase tracking-wider transition-all hover:bg-lime-400/10 hover:border-lime-400 hover:shadow-[0_0_20px_rgba(163,230,53,0.15)] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {status === 'submitting' ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t('formSending')}
                    </span>
                  ) : (
                    t('formSubmit')
                  )}
                </button>

                {/* Error message */}
                {status === 'error' && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {t('formError')}
                  </div>
                )}
              </form>

              {/* Success overlay */}
              {status === 'success' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505]/95 rounded-2xl">
                  <CheckCircle2 className="w-16 h-16 text-lime-400 mb-4" />
                  <p className="text-lg font-semibold text-white text-center px-6">
                    {t('formSuccess')}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
