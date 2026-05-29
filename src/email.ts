interface CardStatusEmailOptions {
  cardNumber: string
  driverName: string
  company: string
  oldStatus: string
  newStatus: string
  performedBy: string
}

export async function sendCardStatusEmail(opts: CardStatusEmailOptions): Promise<void> {
  const serviceUrl = process.env.EMAIL_SERVICE_URL
  if (!serviceUrl) return

  const action = opts.newStatus === 'active' ? 'Activated' : 'Deactivated'
  const subject = `Fleet Card ${action} — ${opts.cardNumber}`

  const html = `
    <p>A fleet card status has been updated via the Fleet Portal.</p>
    <table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
      <tr><td style="color:#6b7280;padding-right:24px">Card Number</td><td><strong>${opts.cardNumber}</strong></td></tr>
      <tr><td style="color:#6b7280">Driver</td><td>${opts.driverName || '—'}</td></tr>
      <tr><td style="color:#6b7280">Company</td><td>${opts.company}</td></tr>
      <tr><td style="color:#6b7280">Previous Status</td><td>${opts.oldStatus.toUpperCase()}</td></tr>
      <tr><td style="color:#6b7280">New Status</td><td><strong>${opts.newStatus.toUpperCase()}</strong></td></tr>
      <tr><td style="color:#6b7280">Updated By</td><td>${opts.performedBy}</td></tr>
      <tr><td style="color:#6b7280">Timestamp</td><td>${new Date().toUTCString()}</td></tr>
    </table>
  `

  const res = await fetch(`${serviceUrl}/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.EMAIL_SERVICE_API_KEY ?? '',
    },
    body: JSON.stringify({
      to: 'ar@gen7fuel.com',
      cc: ['mohammad@gen7fuel.com'],
      subject,
      html,
      from: 'Fleet Portal <noreply@gen7fuel.com>',
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`email-service responded ${res.status}: ${body}`)
  }
}
