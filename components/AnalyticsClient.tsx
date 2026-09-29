// components/AnalyticsClient.tsx
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

const NETWORK_COLORS: Record<string, string> = {
  amazon: "#f97316",
  flipkart: "#3b82f6",
  myntra: "#ec4899",
  other: "#8b5cf6",
};

const NETWORK_META: Record<string, { label: string; emoji: string; bg: string; text: string }> = {
  amazon: { label: "Amazon", emoji: "🛒", bg: "bg-orange-50", text: "text-orange-700" },
  flipkart: { label: "Flipkart", emoji: "🛍️", bg: "bg-blue-50", text: "text-blue-700" },
  myntra: { label: "Myntra", emoji: "👗", bg: "bg-pink-50", text: "text-pink-700" },
  other: { label: "Other", emoji: "🔗", bg: "bg-purple-50", text: "text-purple-700" },
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
      <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 max-w-2xl">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">No data yet</h3>
        <p className="text-sm text-gray-500 max-w-xs mx-auto">
          Add some links and share your page to start seeing click analytics here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-0.5">Track which links your audience loves most.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label="Total Links"
          value={analytics.length.toLocaleString("en-IN")}
          icon="🔗"
          color="indigo"
        />
        <StatCard
          label="Total Clicks"
          value={totalClicks.toLocaleString("en-IN")}
          icon="👆"
          color="green"
        />
        <StatCard
          label="Top Link"
          value={topLink ? topLink.clicks.toLocaleString("en-IN") + " clicks" : "—"}
          icon="🏆"
          color="orange"
          sub={topLink ? truncate(topLink.title, 28) : ""}
        />
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-900">Clicks per Link</h2>
          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">Top {Math.min(sorted.length, 8)}</span>
        </div>
        {totalClicks === 0 ? (
          <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
            Share your page to start getting clicks!
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={sorted.slice(0, 8)}
              margin={{ top: 0, right: 0, left: -24, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis
                dataKey="title"
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                tickFormatter={(v: string) => truncate(v, 12)}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [value, "Clicks"]}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                labelFormatter={(label: any) => truncate(String(label), 40)}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  fontSize: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
                cursor={{ fill: "rgba(99,102,241,0.05)", radius: 8 }}
              />
              <Bar dataKey="clicks" radius={[8, 8, 0, 0]} maxBarSize={56}>
                {sorted.slice(0, 8).map((row, i) => (
                  <Cell
                    key={row.id}
                    fill={NETWORK_COLORS[row.network] ?? "#6366f1"}
                    fillOpacity={i === 0 ? 1 : 0.65}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Link Performance</h2>
          <span className="text-xs text-gray-400">{analytics.length} links</span>
        </div>
        <div className="divide-y divide-gray-50">
          {sorted.map((row, i) => {
            const meta = NETWORK_META[row.network] ?? NETWORK_META.other;
            return (
              <div key={row.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                {/* Rank */}
                <div className="w-6 text-center text-sm font-bold text-gray-300 flex-shrink-0">
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                </div>

                {/* Network badge */}
                <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold ${meta.bg} ${meta.text}`}>
                  {meta.emoji} {meta.label}
                </span>

                {/* Title */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{row.title}</p>
                </div>

                {/* Clicks bar + number */}
                <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
                  <div className="w-24 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: totalClicks > 0 ? `${(row.clicks / sorted[0].clicks) * 100}%` : "0%",
                        backgroundColor: NETWORK_COLORS[row.network] ?? "#6366f1",
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-10 text-right">
                    {row.clicks.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Last clicked */}
                <span className="hidden md:block text-xs text-gray-400 flex-shrink-0 w-20 text-right">
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

function StatCard({
  label,
  value,
  icon,
  sub,
  color,
}: {
  label: string;
  value: string;
  icon: string;
  sub?: string;
  color: "indigo" | "green" | "orange";
}) {
  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    green: "bg-green-50 text-green-600 border-green-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl text-lg mb-3 ${colorMap[color]}`}>
        {icon}
      </div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-xl font-bold text-gray-900 mt-0.5 leading-tight">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1 truncate">{sub}</p>}
    </div>
  );
}
