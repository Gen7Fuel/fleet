/** @jsxImportSource hono/jsx */
import { Layout } from './Layout'
import type { FleetCard } from '../types'

interface CardDetailPageProps {
  username: string
  company: string
  card: FleetCard
  saved?: boolean
  uploadError?: boolean
}

function statusBadge(status: string) {
  const styles: Record<string, string> = {
    active: 'bg-green-100 text-green-700 border-green-200',
    inactive: 'bg-slate-100 text-slate-500 border-slate-200',
    lost: 'bg-orange-100 text-orange-600 border-orange-200',
    stolen: 'bg-red-100 text-red-600 border-red-200',
    cancelled: 'bg-slate-100 text-slate-400 border-slate-200',
  }
  return (
    <span class={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] ?? 'bg-slate-100 text-slate-500 border-slate-200'}`}>
      {status.toUpperCase()}
    </span>
  )
}


function SectionHeading({ children }: { children: any }) {
  return (
    <h3 class="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4 pb-2 border-b border-slate-100">
      {children}
    </h3>
  )
}

function Field({ label, name, value, type = 'text', placeholder = '', required = false }: {
  label: string; name: string; value: string; type?: string; placeholder?: string; required?: boolean
}) {
  return (
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        required={required}
        class="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />
    </div>
  )
}

function formatCardNumber(num: string): string {
  const clean = num.replace(/\D/g, '')
  if (clean.length === 16) return `**** **** **** ${clean.slice(12)}`
  return num
}

export function CardDetailPage({ username, company, card, saved, uploadError }: CardDetailPageProps) {
  const canToggle = card.status === 'active' || card.status === 'inactive'

  return (
    <Layout title={`Card ${formatCardNumber(card.fleetCardNumber)}`} username={username} company={company}>
      {/* Back link */}
      <a href="/dashboard" class="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </a>

      {/* Card header */}
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-md flex items-center justify-center">
            <svg class="w-6 h-4 text-white opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1" />
            </svg>
          </div>
          <div>
            <p class="font-mono text-lg font-semibold text-slate-900">{formatCardNumber(card.fleetCardNumber)}</p>
            <p class="text-xs text-slate-400">
              {card.issuedDate ? `Issued ${card.issuedDate} · ` : ''}{card.driverName || 'No driver assigned'}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          {statusBadge(card.status)}
          {canToggle && (
            <button
              type="button"
              onclick="document.getElementById('status-modal').classList.remove('hidden')"
              class={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                card.status === 'active'
                  ? 'border-red-200 text-red-600 hover:bg-red-50'
                  : 'border-green-200 text-green-600 hover:bg-green-50'
              }`}
            >
              {card.status === 'active' ? 'Deactivate' : 'Activate'}
            </button>
          )}
          {!canToggle && (
            <span class="text-xs text-slate-400 italic">Contact support to change status</span>
          )}
        </div>
      </div>

      {saved && (
        <div class="mb-5 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Card details saved successfully.
        </div>
      )}
      {uploadError && (
        <div class="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Photo upload failed. Please try again.
        </div>
      )}

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Edit form — 2/5 */}
        <div class="lg:col-span-2 space-y-6">
          <form method="POST" action={`/cards/${card.id}`} class="space-y-6">

            {/* Driver info */}
            <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <SectionHeading>Driver Information</SectionHeading>
              <div class="space-y-4">
                <Field label="Driver Name" name="driverName" value={card.driverName} required />
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    Driver Photo <span class="text-slate-400 font-normal">(optional)</span>
                  </label>
                  {card.driverPhoto ? (
                    <div class="flex items-center gap-4">
                      <img
                        src={card.driverPhoto}
                        alt="Driver photo"
                        class="w-16 h-16 rounded-full object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div class="flex flex-col gap-2 min-w-0">
                        <form
                          method="POST"
                          action={`/cards/${card.id}/upload-photo`}
                          enctype="multipart/form-data"
                          class="flex items-center gap-2"
                        >
                          <input
                            type="file"
                            name="photo"
                            accept="image/*"
                            required
                            class="text-xs text-slate-500 w-full file:mr-2 file:text-xs file:font-medium file:border file:border-slate-200 file:rounded-md file:px-2 file:py-1 file:text-slate-600 file:bg-white hover:file:bg-slate-50 file:cursor-pointer"
                          />
                          <button
                            type="submit"
                            class="flex-shrink-0 text-xs px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium whitespace-nowrap"
                          >
                            Re-upload
                          </button>
                        </form>
                        <form method="POST" action={`/cards/${card.id}/remove-photo`}>
                          <button type="submit" class="text-xs text-red-500 hover:text-red-700 font-medium">
                            Remove photo
                          </button>
                        </form>
                      </div>
                    </div>
                  ) : (
                    <form
                      method="POST"
                      action={`/cards/${card.id}/upload-photo`}
                      enctype="multipart/form-data"
                      class="flex items-center gap-4"
                    >
                      <div class="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                        <svg class="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                          <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                        </svg>
                      </div>
                      <div class="flex flex-col gap-2 min-w-0">
                        <input
                          type="file"
                          name="photo"
                          accept="image/*"
                          required
                          class="text-xs text-slate-500 w-full file:mr-2 file:text-xs file:font-medium file:border file:border-slate-200 file:rounded-md file:px-2 file:py-1 file:text-slate-600 file:bg-white hover:file:bg-slate-50 file:cursor-pointer"
                        />
                        <button
                          type="submit"
                          class="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium w-fit"
                        >
                          Upload Photo
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* Vehicle info */}
            <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <SectionHeading>Vehicle Information</SectionHeading>
              <div class="space-y-4">
                <Field label="Number Plate" name="numberPlate" value={card.numberPlate} required placeholder="ABC-123" />
                <Field label="Make & Model" name="vehicleMakeModel" value={card.vehicleMakeModel} placeholder="e.g. Toyota HiLux" />
              </div>
            </div>

            <button
              type="submit"
              class="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </form>
        </div>

        {/* Transaction history — 3/5 */}
        <div class="lg:col-span-3">
          <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <SectionHeading>Transaction History</SectionHeading>
            {card.transactions.length === 0 ? (
              <p class="text-sm text-slate-400 text-center py-6">No transactions recorded.</p>
            ) : (
              <div class="overflow-x-auto -mx-1">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="text-left text-xs text-slate-400 border-b border-slate-100">
                      <th class="pb-2 pr-4 font-medium">Date</th>
                      <th class="pb-2 pr-4 font-medium hidden sm:table-cell">Station</th>
                      <th class="pb-2 pr-4 font-medium hidden md:table-cell">Product</th>
                      <th class="pb-2 pr-4 font-medium hidden md:table-cell text-right">Qty (L)</th>
                      <th class="pb-2 font-medium text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50">
                    {card.transactions.map(tx => (
                      <tr class="hover:bg-slate-50 transition-colors">
                        <td class="py-2.5 pr-4 text-slate-600 whitespace-nowrap">{tx.date}</td>
                        <td class="py-2.5 pr-4 text-slate-500 hidden sm:table-cell whitespace-nowrap">{tx.stationName || '—'}</td>
                        <td class="py-2.5 pr-4 text-slate-500 hidden md:table-cell">{tx.productCode || '—'}</td>
                        <td class="py-2.5 pr-4 text-slate-500 hidden md:table-cell text-right">{tx.quantity.toFixed(1)}</td>
                        <td class="py-2.5 text-slate-900 font-semibold text-right whitespace-nowrap">${tx.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr class="border-t border-slate-200">
                      <td colspan={4} class="pt-3 text-xs text-slate-400 font-medium">Total shown</td>
                      <td class="pt-3 text-right text-sm font-bold text-slate-900">
                        ${card.transactions.reduce((s, t) => s + t.amount, 0).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Status toggle confirmation modal */}
      {canToggle && (
        <>
          <form id="toggle-status-form" method="POST" action={`/cards/${card.id}/toggle-status`} class="hidden" />
          <div id="status-modal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
              <div class="flex items-center gap-3 mb-3">
                <div class={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${card.status === 'active' ? 'bg-red-100' : 'bg-green-100'}`}>
                  {card.status === 'active' ? (
                    <svg class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  ) : (
                    <svg class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <h3 class="text-base font-semibold text-slate-900">
                  {card.status === 'active' ? 'Deactivate Card?' : 'Activate Card?'}
                </h3>
              </div>
              <p class="text-sm text-slate-500 mb-6">
                {card.status === 'active'
                  ? `Card ${formatCardNumber(card.fleetCardNumber)} will be deactivated and can no longer be used for fuel purchases.`
                  : `Card ${formatCardNumber(card.fleetCardNumber)} will be activated and enabled for fuel purchases.`}
              </p>
              <div class="flex gap-3 justify-end">
                <button
                  type="button"
                  onclick="document.getElementById('status-modal').classList.add('hidden')"
                  class="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onclick="document.getElementById('toggle-status-form').submit()"
                  class={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${card.status === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {card.status === 'active' ? 'Yes, Deactivate' : 'Yes, Activate'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  )
}
