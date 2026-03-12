'use client';

import Script from 'next/script';
import {useEffect, useState} from 'react';

const GA_ID = process.env.NEXT_PUBLIC_GA4_ID;

export default function GoogleAnalytics() {
  const [consentGranted, setConsentGranted] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'accepted') {
      setConsentGranted(true);
    }

    // Listen for consent changes from CookieBanner
    const handler = () => {
      const updated = localStorage.getItem('cookieConsent');
      if (updated === 'accepted') {
        setConsentGranted(true);
        // Update consent in gtag
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('consent', 'update', {
            analytics_storage: 'granted',
          });
        }
      }
    };

    window.addEventListener('cookieConsentChanged', handler);
    return () => window.removeEventListener('cookieConsentChanged', handler);
  }, []);

  if (!GA_ID) return null;

  return (
    <>
      {/* Google Consent Mode v2 — default deny */}
      <Script
        id="gtag-consent-default"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
            });
            ${consentGranted ? "gtag('consent', 'update', { 'analytics_storage': 'granted' });" : ''}
          `,
        }}
      />
      {/* GA4 script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `,
        }}
      />
    </>
  );
}
