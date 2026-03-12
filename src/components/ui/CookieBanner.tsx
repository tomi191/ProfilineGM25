"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";

export default function CookieBanner() {
  const t = useTranslations("cookie");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const logConsent = async (consent: boolean) => {
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      await supabase.from('cookie_consents').insert({
        consent,
        user_agent: navigator.userAgent,
      });
    } catch {
      // Silently fail — localStorage is the primary store
    }
  };

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setVisible(false);
    logConsent(true);
    window.dispatchEvent(new Event("cookieConsentChanged"));
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    setVisible(false);
    logConsent(false);
    window.dispatchEvent(new Event("cookieConsentChanged"));
  };

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="max-w-4xl mx-auto bg-[#111] border border-[#333] shadow-2xl rounded-2xl p-6"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-gray-300 text-sm md:text-base">
                {t("message")}
              </p>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={handleDecline}
                  className="bg-transparent border border-gray-600 hover:border-white text-white px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  {t("decline")}
                </button>
                <button
                  onClick={handleAccept}
                  className="border border-lime-400/60 text-lime-400 font-bold px-6 py-2.5 rounded-lg transition-all hover:bg-lime-400/10 hover:border-lime-400 hover:shadow-[0_0_15px_rgba(163,230,53,0.15)] cursor-pointer"
                >
                  {t("accept")}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
