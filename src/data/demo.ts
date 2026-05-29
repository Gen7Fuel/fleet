import type { FleetCard } from '../types'

export const cards: FleetCard[] = []

export function getCurrentMonthSpend(card: FleetCard): number {
  const prefix = new Date().toISOString().slice(0, 7)
  return card.transactions
    .filter(t => t.date.startsWith(prefix))
    .reduce((sum, t) => sum + t.amount, 0)
}

export function getTotalMonthlySpend(): number {
  return cards.reduce((sum, card) => sum + getCurrentMonthSpend(card), 0)
}
