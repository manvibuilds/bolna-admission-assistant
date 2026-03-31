export default function StatusBadge({ status }) {
  const map = {
    'Pending': 'badge-pending',
    'Callback Requested': 'badge-callback',
    'Contacted': 'badge-contacted',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${map[status] || 'badge-pending'}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  )
}
