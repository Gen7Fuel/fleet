/** @jsxImportSource hono/jsx */
import { Layout } from './Layout'
import type { FleetCard } from '../types'
import { getCurrentMonthSpend } from '../data/demo'

interface DashboardPageProps {
  username: string
  company: string
  cards: FleetCard[]
  totalMonthlySpend: number
}

function statusBadge(status: string) {
  const styles: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-slate-100 text-slate-500',
    suspended: 'bg-red-100 text-red-600',
  }
  return (
    <span class={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] ?? 'bg-slate-100 text-slate-500'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function SpendBar({ current, limit }: { current: number; limit: number }) {
  const pct = Math.min((current / limit) * 100, 100)
  const barColor = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-400' : 'bg-blue-500'
  return (
    <div>
      <div class="flex justify-between text-xs text-slate-500 mb-1">
        <span>${current.toFixed(0)} spent</span>
        <span>${limit.toLocaleString()} limit</span>
      </div>
      <div class="w-full bg-slate-100 rounded-full h-1.5">
        <div class={`${barColor} h-1.5 rounded-full transition-all`} style={`width:${pct}%`}></div>
      </div>
    </div>
  )
}

function DriverAvatar({ name, photo }: { name: string; photo?: string }) {
  if (photo) {
    return <img src={photo} alt={name} class="w-10 h-10 rounded-full object-cover border border-slate-200" />
  }
  const initials = name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
  return (
    <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-sm font-semibold border border-blue-200">
      {initials}
    </div>
  )
}

export function DashboardPage({ username, company, cards, totalMonthlySpend }: DashboardPageProps) {
  const active = cards.filter(c => c.status === 'active').length
  const inactive = cards.filter(c => c.status === 'inactive').length
  const suspended = cards.filter(c => c.status === 'suspended').length

  return (
    <Layout title="Dashboard" username={username} company={company}>
      <div class="mb-8">
        <h2 class="text-xl font-bold text-slate-900">Fleet Overview</h2>
        <p class="text-slate-500 text-sm mt-0.5">Manage and monitor your fleet cards</p>
      </div>

      {/* Stats */}
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Total Cards', value: String(cards.length), color: 'text-slate-900' },
          { label: 'Active', value: String(active), color: 'text-green-600' },
          { label: 'Inactive', value: String(inactive), color: 'text-slate-500' },
          { label: 'Suspended', value: String(suspended), color: 'text-red-600' },
          { label: 'Monthly Spend', value: `$${totalMonthlySpend.toFixed(0)}`, color: 'text-blue-600' },
        ].map(stat => (
          <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <p class="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">{stat.label}</p>
            <p class={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Cards grid */}
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map(card => {
          const monthSpend = getCurrentMonthSpend(card)
          return (
            <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
              <div class="flex items-start justify-between">
                <div>
                  <p class="text-xs text-slate-400 font-mono tracking-widest mb-1">FLEET CARD</p>
                  <p class="text-slate-900 font-semibold font-mono">{card.cardNumber}</p>
                </div>
                {statusBadge(card.status)}
              </div>

              <div class="flex items-center gap-3">
                <DriverAvatar name={card.driver.name} photo={card.driver.photo} />
                <div>
                  <p class="text-sm font-medium text-slate-900">{card.driver.name}</p>
                  <p class="text-xs text-slate-400">Driver</p>
                </div>
              </div>

              <div class="flex gap-4 text-xs text-slate-600 bg-slate-50 rounded-lg p-3">
                <div>
                  <p class="text-slate-400 mb-0.5">Vehicle</p>
                  <p class="font-medium">{card.vehicle.year} {card.vehicle.make} {card.vehicle.model}</p>
                </div>
                <div>
                  <p class="text-slate-400 mb-0.5">Plate</p>
                  <p class="font-medium font-mono">{card.vehicle.numberPlate}</p>
                </div>
              </div>

              <SpendBar current={monthSpend} limit={card.monthlySpendingLimit} />

              <a
                href={`/cards/${card.id}`}
                class="mt-auto block text-center w-full py-2 px-4 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors"
              >
                Manage Card
              </a>
            </div>
          )
        })}
      </div>
    </Layout>
  )
}
