const BASE = import.meta.env.VITE_API_URL || 'https://admission-backend-3xyg.onrender.com'

export async function getEnquiries() {
  const res = await fetch(`${BASE}/enquiries`)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

export async function updateStatus(id, status) {
  const res = await fetch(`${BASE}/enquiries/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  })
  return res.json()
}

export async function deleteEnquiry(id) {
  await fetch(`${BASE}/enquiries/${id}`, { method: 'DELETE' })
}

export async function addManualLead(data) {
  const res = await fetch(`${BASE}/webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}
