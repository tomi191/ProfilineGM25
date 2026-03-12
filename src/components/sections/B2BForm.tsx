'use client';

import {useState, FormEvent} from 'react';
import {useTranslations} from 'next-intl';
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

export default function B2BForm() {
  const t = useTranslations('b2b');
  const [status, setStatus] = useState<FormStatus>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');

    // Simulate API call — real endpoint comes in Phase 2
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus('success');
    } catch {
      setStatus('error');
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h2>
            <p className="text-gray-400 text-lg mb-10">{t('desc')}</p>

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
                  className="w-full bg-lime-500 hover:bg-lime-600 text-black font-bold py-4 rounded-lg uppercase tracking-wider transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
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
