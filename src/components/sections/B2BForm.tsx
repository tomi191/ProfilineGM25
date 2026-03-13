'use client';

import {useState, useRef, FormEvent} from 'react';
import {useTranslations, useLocale} from 'next-intl';
import {motion} from 'motion/react';
import {CheckCircle2, AlertCircle, Loader2, Quote, ShieldCheck, Truck, Percent} from 'lucide-react';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';
type BusinessType = 'studio' | 'retail' | 'wholesale' | '';

const inputClasses =
  'w-full bg-[#0a0a0a] border border-[#222] focus:border-lime-500/50 focus:bg-[#111] focus:ring-1 focus:ring-lime-500/50 outline-none px-4 py-3.5 text-white rounded-xl transition-all duration-300 shadow-inner';

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
  const [submitGlow, setSubmitGlow] = useState(false);
  const [businessType, setBusinessType] = useState<BusinessType>('');
  const submitGlowFired = useRef(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');

    const formData = new FormData(e.currentTarget);
    
    // Append business type to message so backend doesn't need schema change
    const originalMessage = formData.get('message') as string;
    const businessTypeLabel = 
      businessType === 'studio' ? 'Detailing Studio / Academy' :
      businessType === 'retail' ? 'Online Retailer' :
      businessType === 'wholesale' ? 'Wholesale Distributor' : 'Not specified';
      
    const enhancedMessage = `[Business Type: ${businessTypeLabel}]\n\n${originalMessage}`;

    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      company: formData.get('company'),
      country: formData.get('country'),
      expected_volume: formData.get('expected_volume'),
      message: enhancedMessage,
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
      setBusinessType('');
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  }

  return (
    <section
      id="b2b-section"
      className="bg-[#050505] py-32 scroll-mt-20 relative overflow-hidden"
    >
      {/* Background Architectural Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(163,230,53,0.03)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#1a1a1a] to-transparent pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 xl:gap-24">
          
          {/* LEFT — B2B Info & Social Proof */}
          <motion.div
            initial={{opacity: 0, x: -30}}
            whileInView={{opacity: 1, x: 0}}
            viewport={{once: true, margin: '-100px'}}
            transition={{duration: 0.6}}
            className="lg:col-span-5 flex flex-col justify-between"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-500/5 border border-lime-500/20 mb-6">
                <ShieldCheck className="w-3.5 h-3.5 text-lime-400" />
                <span className="text-[10px] text-lime-400 uppercase tracking-wider font-semibold">{t('badge')}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-white">{c('title')}</h2>
              <p className="text-gray-400 text-lg mb-12 leading-relaxed">{c('desc')}</p>

              {/* B2B Economics / Advantages */}
              <div className="space-y-8 mb-12">
                <div className="flex gap-5">
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                    <Percent className="w-5 h-5 text-lime-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg mb-1">{t('benefit1Title')}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{t('benefit1Desc')}</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                    <Truck className="w-5 h-5 text-lime-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg mb-1">{t('benefit2Title')}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{t('benefit2Desc')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial / Social Proof */}
            <div className="relative bg-[#0a0a0a] border border-[#1a1a1a] p-8 rounded-2xl">
              <Quote className="absolute top-6 right-6 w-12 h-12 text-[#111] rotate-180" />
              <p className="text-gray-300 italic mb-6 relative z-10 text-sm leading-relaxed">
                &ldquo;{t('testimonialText')}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#222] flex items-center justify-center">
                  <span className="text-gray-500 font-bold text-xs">{t('testimonialInitials')}</span>
                </div>
                <div>
                  <div className="text-white font-bold text-sm">{t('testimonialName')}</div>
                  <div className="text-lime-400 text-xs">{t('testimonialRole')}</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT — Consultative Form */}
          <motion.div
            initial={{opacity: 0, x: 30}}
            whileInView={{opacity: 1, x: 0}}
            viewport={{once: true, margin: '-100px'}}
            transition={{duration: 0.6, delay: 0.1}}
            className="lg:col-span-7 relative"
          >
            {/* Form Container with Premium Glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-b from-[#1a1a1a] to-transparent rounded-[32px] opacity-50" />
            <div className="relative bg-[#050505] border border-[#111] rounded-[30px] p-6 sm:p-10 lg:p-12 shadow-2xl">
              
              <div className="mb-10 text-center">
                <h3 className="text-2xl font-bold text-white mb-2">{t('formTitle')}</h3>
                <p className="text-gray-500 text-sm">{t('formSubtitle')}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Qualification: Business Type */}
                <div className="space-y-3">
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-widest">
                    {t('businessTypeLabel')} <span className="text-lime-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'studio', label: t('businessStudio') },
                      { id: 'retail', label: t('businessRetail') },
                      { id: 'wholesale', label: t('businessWholesale') }
                    ].map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setBusinessType(type.id as BusinessType)}
                        className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all duration-300 ${
                          businessType === type.id 
                            ? 'bg-lime-500/10 border-lime-500 text-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.1)]' 
                            : 'bg-[#0a0a0a] border-[#222] text-gray-400 hover:border-[#333] hover:text-gray-300'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="w-full h-[1px] bg-[#111]" />

                {/* Main Inputs */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-widest ml-1">
                      {t('formName')}
                    </label>
                    <input type="text" name="name" required className={inputClasses} disabled={status === 'submitting' || status === 'success'} placeholder={t('namePlaceholder')} />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-widest ml-1">
                      {t('formEmail')}
                    </label>
                    <input type="email" name="email" required className={inputClasses} disabled={status === 'submitting' || status === 'success'} placeholder="ivan@company.com" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-widest ml-1">
                      {t('formCompany')}
                    </label>
                    <input type="text" name="company" required className={inputClasses} disabled={status === 'submitting' || status === 'success'} placeholder={t('companyPlaceholder')} />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-widest ml-1">
                      {t('formCountry')}
                    </label>
                    <input type="text" name="country" required className={inputClasses} disabled={status === 'submitting' || status === 'success'} placeholder={t('countryPlaceholder')} />
                  </div>
                </div>

                {/* Volume & Message */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-widest ml-1">
                      {t('formVolume')}
                    </label>
                    <select name="expected_volume" className={`${inputClasses} appearance-none text-gray-300`} disabled={status === 'submitting' || status === 'success'}>
                      <option value="">{t('formVolumeSelect')}</option>
                      <option value="10-50">{t('volume1')}</option>
                      <option value="50-200">{t('volume2')}</option>
                      <option value="200+">{t('volume3')}</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-widest ml-1">
                    {t('formMessage')}
                  </label>
                  <textarea name="message" rows={4} required placeholder={t('formMessagePlaceholder')} className={`${inputClasses} resize-none`} disabled={status === 'submitting' || status === 'success'} />
                </div>

                {/* Submit */}
                <motion.div
                  onViewportEnter={() => {
                    if (!submitGlowFired.current) {
                      submitGlowFired.current = true;
                      setSubmitGlow(true);
                    }
                  }}
                  viewport={{once: true, margin: '-50px'}}
                  className="pt-4"
                >
                  <button
                    type="submit"
                    disabled={status === 'submitting' || status === 'success' || !businessType}
                    className={`relative w-full bg-[#A3E635] text-black font-extrabold py-5 rounded-xl uppercase tracking-widest text-sm transition-all duration-300 hover:bg-[#b0f240] hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed group overflow-hidden ${submitGlow ? 'shadow-[0_0_30px_rgba(163,230,53,0.2)]' : ''}`}
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {status === 'submitting' ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> {t('formSending')}</>
                      ) : (
                        t('formSubmit')
                      )}
                    </span>
                  </button>
                  {!businessType && status !== 'success' && (
                    <p className="text-center text-xs text-gray-600 mt-4">{t('businessTypeRequired')}</p>
                  )}
                </motion.div>

                {/* Error message */}
                {status === 'error' && (
                  <div className="flex items-center justify-center gap-2 text-red-400 text-sm bg-red-400/10 py-3 rounded-lg border border-red-400/20">
                    <AlertCircle className="w-4 h-4" />
                    {t('formError')}
                  </div>
                )}
              </form>

              {/* Success overlay */}
              {status === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505]/98 backdrop-blur-md rounded-[30px] z-20 border border-lime-500/20"
                >
                  <div className="w-20 h-20 bg-lime-500/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-lime-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{t('successTitle')}</h3>
                  <p className="text-gray-400 text-center px-8 max-w-sm">
                    {t('formSuccess')}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
