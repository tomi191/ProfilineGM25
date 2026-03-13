export function WebSiteJsonLd({ locale }: { locale: string }) {
  const isBg = locale === 'bg';

  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Profiline GM25',
    alternateName: isBg ? 'Профилайн GM25' : undefined,
    url: 'https://profilinegm25.eu',
    inLanguage: [isBg ? 'bg' : 'en'],
    publisher: {
      '@type': 'Organization',
      name: 'Profiline Tools',
      url: 'https://profilinegm25.eu',
      logo: {
        '@type': 'ImageObject',
        url: 'https://profilinegm25.eu/images/logo.png',
      },
    },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }} />;
}

export function ProductJsonLd({ locale }: { locale: string }) {
  const isBg = locale === 'bg';

  const productData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Profiline GM25 Dual Action Polisher',
    description: isBg
      ? 'Професионална dual-action полираща машина с 1200W мотор и 25мм орбитален ход. Проектирана в България.'
      : 'Professional dual-action orbital polisher with 1200W motor and 25mm throw. Engineered in Bulgaria.',
    brand: { '@type': 'Brand', name: 'Profiline' },
    manufacturer: {
      '@type': 'Organization',
      name: 'Profiline Tools',
      url: 'https://profilinegm25.eu',
    },
    image: 'https://profilinegm25.eu/images/product/gm25-side-view.jpg',
    sku: 'GM25',
    mpn: '25GM',
    countryOfOrigin: { '@type': 'Country', name: 'Bulgaria' },
    material: 'Engineering-grade polymers and metals',
    weight: { '@type': 'QuantitativeValue', value: '2.60', unitCode: 'KGM' },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Power Output', value: '1200W' },
      { '@type': 'PropertyValue', name: 'Orbital Throw', value: '25mm' },
      { '@type': 'PropertyValue', name: 'Speed Range', value: '2200-5800 OPM' },
      { '@type': 'PropertyValue', name: 'Speed Settings', value: '6' },
    ],
  };

  const orgData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Profiline Tools',
    url: 'https://profilinegm25.eu',
    logo: 'https://profilinegm25.eu/images/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contact@profilinegm25.eu',
      contactType: 'sales',
      availableLanguage: ['English', 'Bulgarian'],
    },
    sameAs: ['https://www.facebook.com/profile.php?id=61579498340048'],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgData) }} />
    </>
  );
}

export function FAQJsonLd({ locale }: { locale: string }) {
  const faqs = locale === 'bg' ? [
    { q: 'Какъв е гаранционният срок на Profiline GM25?', a: 'GM25 се предлага с пълна 2-годишна гаранция, покриваща дефекти в материалите и изработката, валидна за всички европейски пазари.' },
    { q: 'Какви подложки са включени?', a: 'GM25 включва както 125мм (5-инчова), така и 150мм (6-инчова) подложка в кутията.' },
    { q: 'Подходяща ли е за начинаещи?', a: 'Въпреки че е проектирана за професионалисти, двойно-действащият механизъм я прави изключително безопасна и лесна за използване дори от начинаещи.' },
    { q: 'Какъв е орбиталният ход?', a: 'Машината разполага с огромен 25мм орбитален ход — един от най-големите на пазара.' },
    { q: 'Как мога да стана дистрибутор?', a: 'Попълнете партньорската форма с данните на вашата компания и нашият екип ще се свърже в рамките на 48 часа.' },
    { q: 'Налични ли са резервни части?', a: 'Да, поддържаме пълен инвентар от резервни части.' },
  ] : [
    { q: 'What is the warranty period for the Profiline GM25?', a: 'The GM25 comes with a comprehensive 2-year warranty covering material and workmanship defects across all European markets.' },
    { q: 'What backing plates are included?', a: 'The GM25 includes both a 125mm (5-inch) and a 150mm (6-inch) backing plate in the box.' },
    { q: 'Is it suitable for beginners?', a: 'While engineered for professionals, the dual-action mechanism makes it extremely safe and easy to use, even for beginners.' },
    { q: 'What is the orbital throw?', a: 'The machine features a massive 25mm orbital throw — one of the largest on the market.' },
    { q: 'How can I become a distributor?', a: 'Fill out the partner form with your company details, and our team will respond within 48 hours.' },
    { q: 'Are spare parts available?', a: 'Yes, we maintain a complete inventory of replacement parts.' },
  ];

  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }} />;
}
