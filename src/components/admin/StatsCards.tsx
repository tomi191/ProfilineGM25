import { Inbox, PhoneCall, BarChart3, TrendingUp } from 'lucide-react';

interface StatsCardsProps {
  newCount: number;
  contactedThisMonth: number;
  totalCount: number;
  conversionRate: string;
}

export default function StatsCards({ newCount, contactedThisMonth, totalCount, conversionRate }: StatsCardsProps) {
  const cards: Array<{ label: string; value: number | string; icon: typeof Inbox; accent: string; bg: string }> = [
    {
      label: 'New Inquiries',
      value: newCount,
      icon: Inbox,
      accent: 'text-lime-400',
      bg: 'bg-lime-500/10',
    },
    {
      label: 'Contacted This Month',
      value: contactedThisMonth,
      icon: PhoneCall,
      accent: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      label: 'Total Inquiries',
      value: totalCount,
      icon: BarChart3,
      accent: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Conversion Rate',
      value: conversionRate,
      icon: TrendingUp,
      accent: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-[#333] bg-[#111] p-6"
        >
          <div className="flex items-center gap-3">
            <div className={`rounded-lg p-2 ${card.bg}`}>
              <card.icon className={`h-5 w-5 ${card.accent}`} />
            </div>
            <span className="text-sm text-gray-400">{card.label}</span>
          </div>
          <p className="mt-3 text-3xl font-bold text-white">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
