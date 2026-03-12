'use client';

import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

type Status = 'new' | 'contacted' | 'closed';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  company: string | null;
  country: string | null;
  expected_volume: string | null;
  message: string | null;
  locale: string | null;
  status: Status;
  created_at: string;
}

type Period = 7 | 30 | 90;

const periodOptions: Array<{ label: string; value: Period }> = [
  { label: '7 days', value: 7 },
  { label: '30 days', value: 30 },
  { label: '90 days', value: 90 },
];

const PIE_COLORS = ['#A3E635', '#FBBF24', '#60A5FA'];

function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function AnalyticsDashboard({ inquiries }: { inquiries: Inquiry[] }) {
  const [period, setPeriod] = useState<Period>(30);

  const filtered = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - period);
    return inquiries.filter((i) => new Date(i.created_at) >= cutoff);
  }, [inquiries, period]);

  // Chart 1: Inquiries over time
  const timeSeriesData = useMemo(() => {
    const map = new Map<string, number>();

    // Fill all days in range
    const now = new Date();
    for (let d = period - 1; d >= 0; d--) {
      const date = new Date(now);
      date.setDate(date.getDate() - d);
      const key = date.toISOString().slice(0, 10);
      map.set(key, 0);
    }

    filtered.forEach((i) => {
      const key = i.created_at.slice(0, 10);
      if (map.has(key)) {
        map.set(key, (map.get(key) ?? 0) + 1);
      }
    });

    return Array.from(map.entries()).map(([date, count]) => ({
      date: formatShortDate(new Date(date + 'T00:00:00')),
      count,
    }));
  }, [filtered, period]);

  // Chart 2: By country
  const countryData = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((i) => {
      const country = i.country || 'Unknown';
      map.set(country, (map.get(country) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [filtered]);

  // Chart 3: Conversion funnel
  const funnelData = useMemo(() => {
    const newCount = filtered.filter((i) => i.status === 'new').length;
    const contactedCount = filtered.filter((i) => i.status === 'contacted').length;
    const closedCount = filtered.filter((i) => i.status === 'closed').length;
    const total = filtered.length;

    const contactedRate = total > 0 ? Math.round(((contactedCount + closedCount) / total) * 100) : 0;
    const closedRate = (contactedCount + closedCount) > 0
      ? Math.round((closedCount / (contactedCount + closedCount)) * 100)
      : 0;

    return { newCount, contactedCount, closedCount, total, contactedRate, closedRate };
  }, [filtered]);

  // Chart 4: By volume tier
  const volumeData = useMemo(() => {
    const tiers: Record<string, number> = {
      '10-50': 0,
      '50-200': 0,
      '200+': 0,
    };

    filtered.forEach((i) => {
      const vol = i.expected_volume ?? '';
      if (vol in tiers) {
        tiers[vol]++;
      } else {
        // Try to classify unknown volumes
        const num = parseInt(vol, 10);
        if (!isNaN(num)) {
          if (num >= 200) tiers['200+']++;
          else if (num >= 50) tiers['50-200']++;
          else tiers['10-50']++;
        }
      }
    });

    return Object.entries(tiers).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const volumeTotal = volumeData.reduce((sum, d) => sum + d.value, 0);

  const hasData = filtered.length > 0;

  return (
    <div>
      {/* Period selector */}
      <div className="mb-6 flex flex-wrap gap-2">
        {periodOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setPeriod(opt.value)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
              period === opt.value
                ? 'bg-lime-500 text-black'
                : 'bg-[#222] text-gray-300 hover:bg-[#333]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Chart 1: Inquiries Over Time */}
        <div className="rounded-2xl border border-[#333] bg-[#111] p-6">
          <h3 className="mb-4 text-sm font-semibold text-white">Inquiries Over Time</h3>
          {!hasData ? (
            <div className="flex h-[300px] items-center justify-center text-sm text-gray-500">
              No data for this period.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#333' }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#333' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: 13,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#A3E635"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#A3E635' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Chart 2: By Country */}
        <div className="rounded-2xl border border-[#333] bg-[#111] p-6">
          <h3 className="mb-4 text-sm font-semibold text-white">By Country (Top 10)</h3>
          {!hasData || countryData.length === 0 ? (
            <div className="flex h-[300px] items-center justify-center text-sm text-gray-500">
              No data for this period.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={countryData} layout="vertical" margin={{ left: 60 }}>
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#333' }}
                />
                <YAxis
                  type="category"
                  dataKey="country"
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#333' }}
                  width={55}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: 13,
                  }}
                />
                <Bar dataKey="count" fill="#A3E635" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Chart 3: Conversion Funnel */}
        <div className="rounded-2xl border border-[#333] bg-[#111] p-6">
          <h3 className="mb-4 text-sm font-semibold text-white">Conversion Funnel</h3>
          {!hasData ? (
            <div className="flex h-[300px] items-center justify-center text-sm text-gray-500">
              No data for this period.
            </div>
          ) : (
            <div className="flex h-[300px] flex-col justify-center gap-4">
              {/* New */}
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-gray-300">New</span>
                  <span className="font-semibold text-white">{funnelData.newCount}</span>
                </div>
                <div className="h-8 w-full rounded-lg bg-[#1a1a1a]">
                  <div
                    className="flex h-8 items-center justify-end rounded-lg bg-lime-400 px-2 text-xs font-bold text-black"
                    style={{
                      width: funnelData.total > 0
                        ? `${Math.max((funnelData.newCount / funnelData.total) * 100, 4)}%`
                        : '4%',
                    }}
                  >
                    {funnelData.newCount}
                  </div>
                </div>
              </div>

              {/* Arrow: New -> Contacted */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <span>&rarr;</span>
                <span>{funnelData.contactedRate}% contacted or closed</span>
              </div>

              {/* Contacted */}
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-gray-300">Contacted</span>
                  <span className="font-semibold text-white">{funnelData.contactedCount}</span>
                </div>
                <div className="h-8 w-full rounded-lg bg-[#1a1a1a]">
                  <div
                    className="flex h-8 items-center justify-end rounded-lg bg-amber-400 px-2 text-xs font-bold text-black"
                    style={{
                      width: funnelData.total > 0
                        ? `${Math.max((funnelData.contactedCount / funnelData.total) * 100, 4)}%`
                        : '4%',
                    }}
                  >
                    {funnelData.contactedCount}
                  </div>
                </div>
              </div>

              {/* Arrow: Contacted -> Closed */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <span>&rarr;</span>
                <span>{funnelData.closedRate}% closed</span>
              </div>

              {/* Closed */}
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-gray-300">Closed</span>
                  <span className="font-semibold text-white">{funnelData.closedCount}</span>
                </div>
                <div className="h-8 w-full rounded-lg bg-[#1a1a1a]">
                  <div
                    className="flex h-8 items-center justify-end rounded-lg bg-blue-400 px-2 text-xs font-bold text-black"
                    style={{
                      width: funnelData.total > 0
                        ? `${Math.max((funnelData.closedCount / funnelData.total) * 100, 4)}%`
                        : '4%',
                    }}
                  >
                    {funnelData.closedCount}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chart 4: By Volume Tier */}
        <div className="rounded-2xl border border-[#333] bg-[#111] p-6">
          <h3 className="mb-4 text-sm font-semibold text-white">By Volume Tier</h3>
          {volumeTotal === 0 ? (
            <div className="flex h-[300px] items-center justify-center text-sm text-gray-500">
              No data for this period.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={volumeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                  stroke="none"
                >
                  {volumeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: 13,
                  }}
                />
                {/* Center label */}
                <text
                  x="50%"
                  y="47%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-white text-2xl font-bold"
                >
                  {volumeTotal}
                </text>
                <text
                  x="50%"
                  y="57%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-gray-400 text-xs"
                >
                  total
                </text>
              </PieChart>
            </ResponsiveContainer>
          )}
          {/* Legend */}
          {volumeTotal > 0 && (
            <div className="mt-4 flex justify-center gap-6">
              {volumeData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2 text-sm text-gray-300">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[i] }}
                  />
                  {d.name} ({d.value})
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
