/** @jsxImportSource hono/jsx */
import { Layout } from './Layout'
import type { FleetCard } from '../types'
import { getCurrentMonthSpend } from '../data/demo'

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
    suspended: 'bg-red-100 text-red-600 border-red-200',
  }
  return (
    <span class={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] ?? 'bg-slate-100 text-slate-500'}`}>
      {status.toUpperCase()}
    </span>
  )
}

function pinBadge(pinStatus: string) {
  const config: Record<string, { color: string; label: string }> = {
    set: { color: 'bg-green-100 text-green-700', label: 'PIN Set' },
    not_set: { color: 'bg-amber-100 text-amber-700', label: 'PIN Not Set' },
    locked: { color: 'bg-red-100 text-red-700', label: 'PIN Locked' },
  }
  const { color, label } = config[pinStatus] ?? config['not_set']
  return <span class={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${color}`}>{label}</span>
}

function SectionHeading({ children }: { children: any }) {
  return (
    <h3 class="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4 pb-2 border-b border-slate-100">
      {children}
    </h3>
  )
}

function Field({ label, name, value, type = 'text', placeholder = '', required = false }: {
  label: string; name: string; value: string | number; type?: string; placeholder?: string; required?: boolean
}) {
  return (
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <input
        type={type}
        name={name}
        value={String(value)}
        placeholder={placeholder}
        required={required}
        class="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />
    </div>
  )
}

export function CardDetailPage({ username, company, card, saved, uploadError }: CardDetailPageProps) {
  const monthSpend = getCurrentMonthSpend(card)
  const spendPct = Math.min((monthSpend / card.monthlySpendingLimit) * 100, 100)
  const barColor = spendPct >= 90 ? 'bg-red-500' : spendPct >= 70 ? 'bg-amber-400' : 'bg-blue-500'

  const fuelOptions: { value: string; label: string }[] = [
    { value: 'any', label: 'Any Fuel' },
    { value: 'diesel', label: 'Diesel Only' },
    { value: 'petrol', label: 'Petrol Only' },
  ]

  return (
    <Layout title={`Card ···· ${card.last4}`} username={username} company={company}>
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
            <p class="font-mono text-lg font-semibold text-slate-900">{card.cardNumber}</p>
            <p class="text-xs text-slate-400">Issued {card.issuedDate} · {card.driver.name}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          {statusBadge(card.status)}
          {card.status !== 'suspended' && (
            <form method="POST" action={`/cards/${card.id}/toggle-status`}>
              <button
                type="submit"
                class={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  card.status === 'active'
                    ? 'border-red-200 text-red-600 hover:bg-red-50'
                    : 'border-green-200 text-green-600 hover:bg-green-50'
                }`}
              >
                {card.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
            </form>
          )}
          {card.status === 'suspended' && (
            <span class="text-xs text-slate-400 italic">Contact support to unsuspend</span>
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
                <Field label="Driver Name" name="driverName" value={card.driver.name} required />
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    Driver Photo <span class="text-slate-400 font-normal">(optional)</span>
                  </label>
                  {card.driver.photo ? (
                    <div class="flex items-center gap-4">
                      <img
                        src={card.driver.photo}
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
                <Field label="Number Plate" name="numberPlate" value={card.vehicle.numberPlate} required placeholder="ABC-123" />
                <div class="grid grid-cols-2 gap-3">
                  <Field label="Make" name="vehicleMake" value={card.vehicle.make} required />
                  <Field label="Model" name="vehicleModel" value={card.vehicle.model} required />
                </div>
                <Field label="Year" name="vehicleYear" value={card.vehicle.year} type="number" required />
              </div>
            </div>

            {/* Card settings */}
            <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <SectionHeading>Card Settings</SectionHeading>
              <div class="space-y-4">
                <Field label="Monthly Spending Limit ($)" name="spendingLimit" value={card.monthlySpendingLimit} type="number" required />
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1.5">Fuel Type Restriction</label>
                  <select
                    name="fuelType"
                    class="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                  >
                    {fuelOptions.map(opt => (
                      <option value={opt.value} selected={card.fuelType === opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1.5">PIN Status</label>
                  <div class="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                    {pinBadge(card.pinStatus)}
                    <span class="text-xs text-slate-400">Managed by Gen7</span>
                  </div>
                </div>
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
        <div class="lg:col-span-3 space-y-5">
          {/* Spend summary */}
          <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <SectionHeading>Monthly Spend</SectionHeading>
            <div class="flex items-end gap-2 mb-3">
              <span class="text-2xl font-bold text-slate-900">${monthSpend.toFixed(2)}</span>
              <span class="text-slate-400 text-sm pb-0.5">of ${card.monthlySpendingLimit.toLocaleString()} limit</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2">
              <div class={`${barColor} h-2 rounded-full`} style={`width:${spendPct}%`}></div>
            </div>
            <p class="text-xs text-slate-400 mt-2">{spendPct.toFixed(0)}% of monthly limit used</p>
          </div>

          {/* Transactions */}
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
                      <th class="pb-2 pr-4 font-medium hidden sm:table-cell">Location</th>
                      <th class="pb-2 pr-4 font-medium hidden md:table-cell">Fuel</th>
                      <th class="pb-2 pr-4 font-medium hidden md:table-cell text-right">Litres</th>
                      <th class="pb-2 font-medium text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50">
                    {card.transactions.map(tx => (
                      <tr class="hover:bg-slate-50 transition-colors">
                        <td class="py-2.5 pr-4 text-slate-600 whitespace-nowrap">{tx.date}</td>
                        <td class="py-2.5 pr-4 text-slate-500 hidden sm:table-cell whitespace-nowrap">{tx.location}</td>
                        <td class="py-2.5 pr-4 text-slate-500 hidden md:table-cell">{tx.fuelType}</td>
                        <td class="py-2.5 pr-4 text-slate-500 hidden md:table-cell text-right">{tx.litres.toFixed(1)}L</td>
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
    </Layout>
  )
}
