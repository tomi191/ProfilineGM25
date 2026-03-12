'use client';

import {useTranslations} from 'next-intl';
import {Settings, Award, ShieldCheck, Truck, Wrench} from 'lucide-react';

const trustItems = [
  {key: 'item1', Icon: Settings},
  {key: 'item2', Icon: Award},
  {key: 'item3', Icon: ShieldCheck},
  {key: 'item4', Icon: Truck},
  {key: 'item5', Icon: Wrench},
] as const;

export default function TrustBar() {
  const t = useTranslations('trust');

  return (
    <section className="bg-[#0a0a0a] border-y border-[#1a1a1a] py-8 relative z-30">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {trustItems.map(({key, Icon}) => (
            <div key={key} className="group relative flex flex-col items-center text-center">
              <Icon className="w-8 h-8 text-lime-400 mb-3" />
              <span className="text-xs md:text-sm font-medium text-gray-400 uppercase tracking-wider">
                {t(key)}
              </span>

              {/* CSS-only tooltip */}
              <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-40">
                <div className="bg-[#111] border border-[#333] text-sm text-gray-300 p-3 rounded-lg shadow-xl">
                  {t(`${key}Tooltip` as 'item1Tooltip')}
                </div>
                {/* Arrow */}
                <div className="mx-auto w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#333]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
