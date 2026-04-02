import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  RefreshCw,
  Phone,
  Users,
  UserCheck,
  BookOpen,
  Search,
} from "lucide-react";
import { getEnquiries, updateStatus } from "../api";
import StatusBadge from "../components/StatusBadge";
import AddLeadModal from "../components/AddLeadModal";
import { normalizeEnquiry } from "../utils/normalizers";

const STATUS_CYCLE = ["Pending", "Callback Requested", "Contacted"];

export default function Dashboard() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setSyncing(true);
    try {
      const data = await getEnquiries();
      setEnquiries((data.enquiries || []).map(normalizeEnquiry));
      setError(false);
      setLastSync(new Date());
    } catch {
      setError(true);
    }
    setLoading(false);
    setSyncing(false);
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleCycleStatus = async (e) => {
    const cur = e.status;
    const next =
      STATUS_CYCLE[(STATUS_CYCLE.indexOf(cur) + 1) % STATUS_CYCLE.length];
    setEnquiries((prev) =>
      prev.map((x) => (x.id === e.id ? { ...x, status: next } : x)),
    );
    try {
      await updateStatus(e.id, next);
    } catch {}
  };

  const filtered = enquiries.filter((e) => {
    const matchFilter = filter === "all" || e.status === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (e.child_name || "").toLowerCase().includes(q) ||
      (e.parent_name || "").toLowerCase().includes(q) ||
      (e.phone_number || "").includes(q) ||
      (e.grade || "").toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const stats = [
    {
      label: "Total Enquiries",
      value: enquiries.length,
      icon: Phone,
      color: "text-brand-500",
    },
    {
      label: "Callbacks Pending",
      value: enquiries.filter((e) => e.status === "Callback Requested").length,
      icon: Users,
      color: "text-blue-500",
    },
    {
      label: "Contacted",
      value: enquiries.filter((e) => e.status === "Contacted").length,
      icon: UserCheck,
      color: "text-green-500",
    },
    {
      label: "Top Grade",
      value: (() => {
        const gc = {};
        enquiries.forEach((e) => {
          if (e.grade) gc[e.grade] = (gc[e.grade] || 0) + 1;
        });
        const top = Object.entries(gc).sort((a, b) => b[1] - a[1])[0];
        return top ? top[0] : "—";
      })(),
      icon: BookOpen,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl text-zinc-900 dark:text-zinc-100">
            Admission Dashboard
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Live enquiries from voice agent calls
          </p>
          {lastSync && (
            <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
              <span
                className={`w-1.5 h-1.5 rounded-full ${error ? "bg-red-400" : "bg-green-400"} inline-block`}
              />
              {error
                ? "Sync failed — retrying"
                : `Last synced ${lastSync.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`}
              {syncing && <RefreshCw size={10} className="animate-spin ml-1" />}
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => fetchData(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 dark:border-zinc-700 text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />{" "}
            Refresh
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors"
          >
            <Plus size={14} /> Add Lead
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                {s.label}
              </p>
              <s.icon size={15} className={s.color} />
            </div>
            <p className="font-serif text-4xl text-zinc-900 dark:text-zinc-100">
              {loading ? "—" : s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters + Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-serif text-xl text-zinc-900 dark:text-zinc-100">
            All Leads
          </h2>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-600"
            />
            <input
              className="pl-8 pr-4 py-2 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-brand-500 transition-colors w-52"
              placeholder="Search name, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-1.5">
            {[
              ["all", "All"],
              ["Pending", "Pending"],
              ["Callback Requested", "Callback"],
              ["Contacted", "Contacted"],
            ].map(([v, l]) => (
              <button
                key={v}
                onClick={() => setFilter(v)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${filter === v ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-gray-400 dark:hover:border-zinc-600"}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-zinc-400">
            <RefreshCw size={20} className="animate-spin mr-2" /> Loading
            leads...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-xl text-zinc-400">No leads found</p>
            <p className="text-sm text-zinc-400 mt-2">
              Leads appear automatically when parents call the voice agent.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                  {[
                    "Child",
                    "Grade",
                    "Parent",
                    "Phone",
                    "Date",
                    "Query",
                    "Status",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                {filtered.map((e) => (
                  <tr
                    key={e.id}
                    className="hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                        {e.child_name || "—"}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800">
                        {e.grade || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-zinc-700 dark:text-zinc-300">
                        {e.parent_name || "—"}
                      </p>
                      {e.callback_time && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                          📞 {e.callback_time}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-mono text-zinc-600 dark:text-zinc-400">
                        {e.phone_number || "—"}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs text-zinc-600 dark:text-zinc-500">
                        {e.date}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-500">
                        {e.time}
                      </p>
                    </td>
                    <td className="px-5 py-4 max-w-[160px]">
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate">
                        {e.query_summary || "—"}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={e.status} />
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleCycleStatus(e)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-400 hover:border-brand-500 hover:text-brand-500 transition-colors"
                      >
                        Mark →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <AddLeadModal
          onClose={() => setShowModal(false)}
          onSaved={() => fetchData(true)}
        />
      )}
    </div>
  );
}
