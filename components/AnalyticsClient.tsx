// components/AnalyticsClient.tsx
// Apple & Nike Tier Analytics UI
"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface AnalyticsRow {
  id: string;
  title: string;
  network: string;
  clicks: number;
  lastClicked: string | null;
}

interface Props {
  analytics: AnalyticsRow[];
}

const NETWORK_META: Record<string, { label: string; emoji: string; bg: string; text: string }> = {
  amazon:   { label: "Amazon", emoji: "🛒", bg: "bg-orange-50", text: "text-orange-700" },
  flipkart: { label: "Flipkart", emoji: "🛍️", bg: "bg-blue-50", text: "text-blue-700" },
  myntra:   { label: "Myntra", emoji: "👗", bg: "bg-pink-50", text: "text-pink-700" },
  other:    { label: "Store", emoji: "🔗", bg: "bg-neutral-100", text: "text-neutral-700" },
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function truncate(str: string, n: number) {
  return str.length > n ? str.slice(0, n) + "…" : str;
}

export function AnalyticsClient({ analytics }: Props) {
  const totalClicks = analytics.reduce((s, r) => s + r.clicks, 0);
  const sorted = [...analytics].sort((a, b) => b.clicks - a.clicks);
  const topLink = sorted[0];

  if (analytics.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-neutral-300 max-w-2xl p-8">
        <div className="text-5xl mb-3">📊</div>
        <h2 className="text-base font-bold text-neutral-900 mb-1">No clicks recorded yet</h2>
        <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
          Share your bio link on Instagram, YouTube, or WhatsApp to start tracking click attribution.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-7 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-950">
          Audience Insights
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Monitor product engagement, click volume, and top-converting recommendations.
        </p>
      </div>

      {/* High-Impact Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white rounded-2xl border border-black/[0.06] p-5 shadow-2xs">
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Total Links
          </p>
          <p className="text-3xl font-bold text-neutral-950 mt-1 tracking-tight">
            {analytics.length.toLocaleString("en-IN")}
          </p>
          <p className="text-[11px] text-neutral-500 mt-1">Active storefront items</p>
        </div>

        <div className="bg-white rounded-2xl border border-black/[0.06] p-5 shadow-2xs">
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Total Clicks
          </p>
          <p className="text-3xl font-bold text-neutral-950 mt-1 tracking-tight">
            {totalClicks.toLocaleString("en-IN")}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">All-time redirects</p>
        </div>

        <div className="bg-white rounded-2xl border border-black/[0.06] p-5 shadow-2xs">
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Top Performing Link
          </p>
          <p className="text-2xl font-bold text-neutral-950 mt-1 tracking-tight truncate">
            {topLink ? `${topLink.clicks.toLocaleString("en-IN")} clicks` : "—"}
          </p>
          {topLink && (
            <p className="text-[11px] text-neutral-500 mt-1 truncate font-medium">
              {topLink.title}
            </p>
          )}
        </div>
      </div>

      {/* Refined Recharts Bar Chart */}
      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-2xs p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-bold text-neutral-900">
              Clicks per Recommendation
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">Top 8 items by volume</p>
          </div>
          <span className="text-xs text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full font-medium">
            Live
          </span>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sorted.slice(0, 8)}
              margin={{ top: 10, right: 10, left: -24, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
              <XAxis
                dataKey="title"
                tick={{ fontSize: 10, fill: "#71717a" }}
                tickFormatter={(v: string) => truncate(v, 12)}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#71717a" }}
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [value, "Clicks"]}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                labelFormatter={(label: any) => String(label)}
                contentStyle={{
                  borderRadius: "14px",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                  fontSize: "12px",
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(12px)",
                }}
                cursor={{ fill: "rgba(0, 0, 0, 0.03)", radius: 8 }}
              />
              <Bar dataKey="clicks" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {sorted.slice(0, 8).map((_, i) => (
                  <Cell
                    key={i}
                    fill={i === 0 ? "#111111" : "#4338ca"}
                    fillOpacity={i === 0 ? 0.95 : 0.75 - i * 0.07}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Link Performance Table */}
      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-neutral-900">
            Performance Breakdown
          </h2>
          <span className="text-xs text-neutral-400">{analytics.length} total items</span>
        </div>

        <div className="divide-y divide-neutral-100 text-xs">
          {sorted.map((row, i) => {
            const meta = NETWORK_META[row.network] ?? NETWORK_META.other;
            return (
              <div
                key={row.id}
                className="flex items-center gap-4 px-6 py-3.5 hover:bg-neutral-50/60 transition-colors"
              >
                <div className="w-5 text-center font-bold text-neutral-400 flex-shrink-0">
                  {i + 1}
                </div>

                <span className={`flex-shrink-0 px-2 py-0.5 rounded-md font-semibold text-[10px] ${meta.bg} ${meta.text}`}>
                  {meta.emoji} {meta.label}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-neutral-900 truncate">
                    {row.title}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
                  <div className="w-24 bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-neutral-900"
                      style={{
                        width: totalClicks > 0 ? `${(row.clicks / sorted[0].clicks) * 100}%` : "0%",
                      }}
                    />
                  </div>
                  <span className="font-bold text-neutral-900 w-12 text-right">
                    {row.clicks.toLocaleString("en-IN")}
                  </span>
                </div>

                <span className="hidden md:block text-neutral-400 flex-shrink-0 w-20 text-right">
                  {formatDate(row.lastClicked)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
