import { useState, useEffect } from "react";
import { getEnquiries } from "../api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { RefreshCw } from "lucide-react";

const COLORS = [
  "#c84b2f",
  "#3b82f6",
  "#22c55e",
  "#a855f7",
  "#f59e0b",
  "#06b6d4",
];

export default function Analytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEnquiries()
      .then((d) => {
        setData(d.enquiries || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Grade distribution
  const gradeData = Object.entries(
    data.reduce((acc, e) => {
      if (e.grade) acc[e.grade] = (acc[e.grade] || 0) + 1;
      return acc;
    }, {}),
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  // Status distribution
  const statusData = [
    {
      name: "Pending",
      value: data.filter((e) => e.status === "Pending").length,
    },
    {
      name: "Callback",
      value: data.filter((e) => e.status === "Callback Requested").length,
    },
    {
      name: "Contacted",
      value: data.filter((e) => e.status === "Contacted").length,
    },
  ].filter((d) => d.value > 0);

  // Callback rate
  const callbackRate = data.length
    ? Math.round(
        (data.filter((e) => e.callback_requested === "yes").length /
          data.length) *
          100,
      )
    : 0;

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-zinc-400">
        <RefreshCw size={20} className="animate-spin mr-2" /> Loading
        analytics...
      </div>
    );

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-zinc-900 dark:text-zinc-100">
          Analytics
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          Insights from admission enquiry calls
        </p>
      </div>

      {data.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="font-serif text-xl text-zinc-400">No data yet</p>
          <p className="text-sm text-zinc-400 mt-2">
            Analytics will appear once calls start coming in.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* KPI row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total Leads", value: data.length },
              { label: "Callback Rate", value: `${callbackRate}%` },
              {
                label: "Contacted",
                value: data.filter((e) => e.status === "Contacted").length,
              },
            ].map((k) => (
              <div key={k.label} className="card p-5 text-center">
                <p className="font-serif text-4xl text-zinc-900 dark:text-zinc-100">
                  {k.value}
                </p>
                <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mt-2">
                  {k.label}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Grade chart */}
            <div className="card p-6">
              <h3 className="font-serif text-lg text-zinc-900 dark:text-zinc-100 mb-1">
                Enquiries by Grade
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-5">
                Distribution across grade levels
              </p>
              {gradeData.length === 0 ? (
                <p className="text-sm text-zinc-400 text-center py-8">
                  No grade data yet
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart
                    data={gradeData}
                    margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                  >
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Bar
                      dataKey="value"
                      fill="#c84b2f"
                      radius={[4, 4, 0, 0]}
                      name="Enquiries"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Status pie */}
            <div className="card p-6">
              <h3 className="font-serif text-lg text-zinc-900 dark:text-zinc-100 mb-1">
                Lead Status Breakdown
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-5">
                Current status distribution
              </p>
              {statusData.length === 0 ? (
                <p className="text-sm text-zinc-400 text-center py-8">
                  No status data yet
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      dataKey="value"
                      paddingAngle={3}
                    >
                      {statusData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Legend
                      iconSize={10}
                      iconType="circle"
                      wrapperStyle={{ fontSize: 12 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
