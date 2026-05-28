import { getCurrentMonthSpend, getTotalMonthlySpend } from '../data/demo'
import type { FleetCard } from '../types'

const currentMonth = new Date().toISOString().slice(0, 7)

function makeCard(overrides: Partial<FleetCard> = {}): FleetCard {
  return {
    id: 'test-1',
    cardNumber: '**** **** **** 0000',
    last4: '0000',
    status: 'active',
    driver: { name: 'Test Driver' },
    vehicle: { numberPlate: 'TST-001', make: 'Toyota', model: 'Hilux', year: 2022 },
    monthlySpendingLimit: 1000,
    fuelType: 'diesel',
    pinStatus: 'set',
    issuedDate: '2023-01-01',
    transactions: [],
    ...overrides,
  }
}

describe('getCurrentMonthSpend', () => {
  it('returns 0 when there are no transactions', () => {
    const card = makeCard({ transactions: [] })
    expect(getCurrentMonthSpend(card)).toBe(0)
  })

  it('returns 0 when all transactions are from a different month', () => {
    const card = makeCard({
      transactions: [
        { id: 'a', date: '2024-01-10', location: 'Somewhere', fuelType: 'Diesel', litres: 50, pricePerLitre: 1.9, amount: 95 },
        { id: 'b', date: '2024-01-20', location: 'Somewhere', fuelType: 'Diesel', litres: 40, pricePerLitre: 1.9, amount: 76 },
      ],
    })
    expect(getCurrentMonthSpend(card)).toBe(0)
  })

  it('sums only the current month transactions', () => {
    const card = makeCard({
      transactions: [
        { id: 'a', date: `${currentMonth}-05`, location: 'Somewhere', fuelType: 'Diesel', litres: 50, pricePerLitre: 2.0, amount: 100 },
        { id: 'b', date: `${currentMonth}-15`, location: 'Somewhere', fuelType: 'Diesel', litres: 30, pricePerLitre: 2.0, amount: 60 },
      ],
    })
    expect(getCurrentMonthSpend(card)).toBeCloseTo(160, 5)
  })

  it('ignores transactions from a different month when mixed with current-month ones', () => {
    const card = makeCard({
      transactions: [
        { id: 'a', date: `${currentMonth}-10`, location: 'Somewhere', fuelType: 'Diesel', litres: 50, pricePerLitre: 2.0, amount: 100 },
        { id: 'b', date: '2024-01-10', location: 'Somewhere', fuelType: 'Diesel', litres: 40, pricePerLitre: 2.0, amount: 80 },
        { id: 'c', date: `${currentMonth}-20`, location: 'Somewhere', fuelType: 'Diesel', litres: 25, pricePerLitre: 2.0, amount: 50 },
      ],
    })
    expect(getCurrentMonthSpend(card)).toBeCloseTo(150, 5)
  })
})

describe('getTotalMonthlySpend', () => {
  it('returns a number greater than or equal to 0', () => {
    const total = getTotalMonthlySpend()
    expect(typeof total).toBe('number')
    expect(total).toBeGreaterThanOrEqual(0)
  })
})
