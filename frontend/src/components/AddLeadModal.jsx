import { useState } from "react";
import { X } from "lucide-react";
import { addManualLead } from "../api";

const GRADES = [
  "Nursery",
  "LKG",
  "UKG",
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
];

export default function AddLeadModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    child_name: "",
    grade: "",
    parent_name: "",
    phone_number: "",
    callback_requested: "no",
    query_summary: "",
  });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (
      !form.child_name ||
      !form.grade ||
      !form.parent_name ||
      !form.phone_number
    ) {
      alert("Please fill all required fields.");
      return;
    }
    setLoading(true);
    try {
      await addManualLead(form);
      onSaved();
      onClose();
    } catch {
      alert("Could not save. Check your backend connection.");
    }
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-zinc-800">
          <div>
            <h2 className="font-serif text-xl text-zinc-900 dark:text-zinc-100">
              Add Enquiry Lead
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
              Manually add a new lead
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-400 mb-1.5">
                Child's Name *
              </label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-brand-500 transition-colors"
                placeholder="e.g. Arjun"
                value={form.child_name}
                onChange={(e) => set("child_name", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-400 mb-1.5">
                Grade *
              </label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-brand-500 transition-colors"
                value={form.grade}
                onChange={(e) => set("grade", e.target.value)}
              >
                <option value="">Select</option>
                {GRADES.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-400 mb-1.5">
              Parent Name *
            </label>
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-brand-500 transition-colors"
              placeholder="e.g. Sunita Sharma"
              value={form.parent_name}
              onChange={(e) => set("parent_name", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-400 mb-1.5">
              Phone Number *
            </label>
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-brand-500 transition-colors"
              placeholder="9876543210"
              value={form.phone_number}
              onChange={(e) => set("phone_number", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-400 mb-1.5">
              Query Summary
            </label>
            <textarea
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-brand-500 transition-colors resize-none"
              rows={2}
              placeholder="What did the parent ask about..."
              value={form.query_summary}
              onChange={(e) => set("query_summary", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-400 mb-1.5">
              Callback Requested?
            </label>
            <div className="flex gap-3">
              {["yes", "no"].map((v) => (
                <button
                  key={v}
                  onClick={() => set("callback_requested", v)}
                  className={`px-4 py-1.5 rounded-lg text-sm border transition-colors capitalize ${form.callback_requested === v ? "bg-brand-500 text-white border-brand-500" : "border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400"}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 pt-0 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2 rounded-lg text-sm bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Lead"}
          </button>
        </div>
      </div>
    </div>
  );
}
