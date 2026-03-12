import {setRequestLocale} from 'next-intl/server';

export default async function Home({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold text-lime-400">Profiline GM25 — Coming Soon</h1>
    </main>
  );
}
