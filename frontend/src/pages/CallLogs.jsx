import { useState, useEffect } from 'react'
import { Phone, RefreshCw, Trash2 } from 'lucide-react'
import { getEnquiries, deleteEnquiry } from '../api'
import StatusBadge from '../components/StatusBadge'

export default function CallLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = async () => {
    setLoading(true)
    try {
      const data = await getEnquiries()
      setLogs(data.enquiries || [])
    } catch {}
    setLoading(false)
  }

  useEffect(() => { fetch() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this lead?')) return
    setLogs(prev => prev.filter(l => l.id !== id))
    try { await deleteEnquiry(id) } catch {}
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl text-zinc-900 dark:text-zinc-100">Call Logs</h1>
          <p className="text-sm text-zinc-400 mt-1">कॉल इतिहास — Complete history of all enquiry calls</p>
        </div>
        <button onClick={fetch} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-zinc-400">
          <RefreshCw size={20} className="animate-spin mr-2" /> Loading...
        </div>
      ) : logs.length === 0 ? (
        <div className="card p-16 text-center">
          <Phone size={32} className="text-zinc-300 mx-auto mb-4" />
          <p className="font-serif text-xl text-zinc-400">No call logs yet</p>
          <p className="text-sm text-zinc-400 mt-2">Calls will appear here once parents start calling the agent.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log, i) => (
            <div key={log.id} className="card p-5 flex items-start gap-4 hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center shrink-0">
                <Phone size={15} className="text-brand-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{log.child_name || 'Unknown Child'}</p>
                  {log.grade && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800">
                      {log.grade}
                    </span>
                  )}
                  <StatusBadge status={log.status} />
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Parent: <span className="text-zinc-700 dark:text-zinc-300">{log.parent_name || '—'}</span>
                  {' · '}
                  Phone: <span className="font-mono text-zinc-700 dark:text-zinc-300">{log.phone_number || '—'}</span>
                </p>
                {log.query_summary && (
                  <p className="text-xs text-zinc-400 mt-1.5 bg-zinc-50 dark:bg-zinc-800 rounded-lg px-3 py-1.5">
                    "{log.query_summary}"
                  </p>
                )}
                {log.callback_requested === 'yes' && (
                  <p className="text-xs text-blue-500 mt-1.5 flex items-center gap-1">
                    📞 Callback requested {log.callback_time ? `at ${log.callback_time}` : ''}
                  </p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-zinc-400">{log.date}</p>
                <p className="text-xs text-zinc-300 dark:text-zinc-600">{log.time}</p>
                <button onClick={() => handleDelete(log.id)} className="mt-2 text-zinc-300 hover:text-red-400 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
