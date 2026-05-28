import type { FleetCard } from '../types'

export const cards: FleetCard[] = [
  {
    id: '1',
    cardNumber: '**** **** **** 8472',
    last4: '8472',
    status: 'active',
    driver: { name: 'John Smith' },
    vehicle: { numberPlate: 'ABC-123', make: 'Toyota', model: 'Hilux', year: 2022 },
    monthlySpendingLimit: 2000,
    fuelType: 'diesel',
    pinStatus: 'set',
    issuedDate: '2023-03-15',
    transactions: [
      { id: 't1-1', date: '2026-05-25', location: 'Melbourne VIC', fuelType: 'Diesel', litres: 65.3, pricePerLitre: 1.92, amount: 125.38 },
      { id: 't1-2', date: '2026-05-18', location: 'Dandenong VIC', fuelType: 'Diesel', litres: 70.1, pricePerLitre: 1.89, amount: 132.49 },
      { id: 't1-3', date: '2026-05-11', location: 'Frankston VIC', fuelType: 'Diesel', litres: 68.4, pricePerLitre: 1.95, amount: 133.38 },
      { id: 't1-4', date: '2026-05-04', location: 'Melbourne VIC', fuelType: 'Diesel', litres: 72.0, pricePerLitre: 1.91, amount: 137.52 },
      { id: 't1-5', date: '2026-04-27', location: 'Dandenong VIC', fuelType: 'Diesel', litres: 66.8, pricePerLitre: 1.88, amount: 125.58 },
      { id: 't1-6', date: '2026-04-20', location: 'Frankston VIC', fuelType: 'Diesel', litres: 69.2, pricePerLitre: 1.90, amount: 131.48 },
    ],
  },
  {
    id: '2',
    cardNumber: '**** **** **** 3891',
    last4: '3891',
    status: 'active',
    driver: { name: 'Sarah Johnson' },
    vehicle: { numberPlate: 'XYZ-456', make: 'Ford', model: 'Ranger', year: 2023 },
    monthlySpendingLimit: 1500,
    fuelType: 'diesel',
    pinStatus: 'set',
    issuedDate: '2023-07-01',
    transactions: [
      { id: 't2-1', date: '2026-05-24', location: 'Sunshine VIC', fuelType: 'Diesel', litres: 58.2, pricePerLitre: 1.93, amount: 112.33 },
      { id: 't2-2', date: '2026-05-17', location: 'Footscray VIC', fuelType: 'Diesel', litres: 61.0, pricePerLitre: 1.91, amount: 116.51 },
      { id: 't2-3', date: '2026-05-10', location: 'Werribee VIC', fuelType: 'Diesel', litres: 60.7, pricePerLitre: 1.94, amount: 117.76 },
      { id: 't2-4', date: '2026-05-03', location: 'Sunshine VIC', fuelType: 'Diesel', litres: 63.5, pricePerLitre: 1.90, amount: 120.65 },
      { id: 't2-5', date: '2026-04-26', location: 'Footscray VIC', fuelType: 'Diesel', litres: 59.1, pricePerLitre: 1.89, amount: 111.70 },
      { id: 't2-6', date: '2026-04-19', location: 'Werribee VIC', fuelType: 'Diesel', litres: 62.3, pricePerLitre: 1.92, amount: 119.62 },
    ],
  },
  {
    id: '3',
    cardNumber: '**** **** **** 5124',
    last4: '5124',
    status: 'active',
    driver: { name: 'Mike Brown' },
    vehicle: { numberPlate: 'DEF-789', make: 'Isuzu', model: 'D-Max', year: 2021 },
    monthlySpendingLimit: 1200,
    fuelType: 'any',
    pinStatus: 'set',
    issuedDate: '2022-11-20',
    transactions: [
      { id: 't3-1', date: '2026-05-22', location: 'Richmond VIC', fuelType: 'Diesel', litres: 55.0, pricePerLitre: 1.94, amount: 106.70 },
      { id: 't3-2', date: '2026-05-14', location: 'Collingwood VIC', fuelType: 'Diesel', litres: 57.6, pricePerLitre: 1.92, amount: 110.59 },
      { id: 't3-3', date: '2026-05-07', location: 'Fitzroy VIC', fuelType: 'Diesel', litres: 53.4, pricePerLitre: 1.91, amount: 102.00 },
      { id: 't3-4', date: '2026-04-30', location: 'Richmond VIC', fuelType: 'Diesel', litres: 58.8, pricePerLitre: 1.89, amount: 111.13 },
      { id: 't3-5', date: '2026-04-23', location: 'Collingwood VIC', fuelType: 'Diesel', litres: 56.2, pricePerLitre: 1.93, amount: 108.47 },
    ],
  },
  {
    id: '4',
    cardNumber: '**** **** **** 7263',
    last4: '7263',
    status: 'inactive',
    driver: { name: 'Emma Wilson' },
    vehicle: { numberPlate: 'GHI-012', make: 'Nissan', model: 'Navara', year: 2020 },
    monthlySpendingLimit: 1000,
    fuelType: 'diesel',
    pinStatus: 'set',
    issuedDate: '2022-06-10',
    transactions: [
      { id: 't4-1', date: '2026-03-28', location: 'Geelong VIC', fuelType: 'Diesel', litres: 64.1, pricePerLitre: 1.87, amount: 119.87 },
      { id: 't4-2', date: '2026-03-14', location: 'Geelong VIC', fuelType: 'Diesel', litres: 67.3, pricePerLitre: 1.86, amount: 125.18 },
      { id: 't4-3', date: '2026-02-28', location: 'Geelong VIC', fuelType: 'Diesel', litres: 65.8, pricePerLitre: 1.85, amount: 121.73 },
      { id: 't4-4', date: '2026-02-14', location: 'Geelong VIC', fuelType: 'Diesel', litres: 63.2, pricePerLitre: 1.88, amount: 118.82 },
    ],
  },
  {
    id: '5',
    cardNumber: '**** **** **** 9047',
    last4: '9047',
    status: 'active',
    driver: { name: 'David Lee' },
    vehicle: { numberPlate: 'JKL-345', make: 'Mitsubishi', model: 'Triton', year: 2023 },
    monthlySpendingLimit: 1800,
    fuelType: 'petrol',
    pinStatus: 'locked',
    issuedDate: '2024-01-08',
    transactions: [
      { id: 't5-1', date: '2026-05-26', location: 'Box Hill VIC', fuelType: 'Petrol', litres: 50.2, pricePerLitre: 1.88, amount: 94.38 },
      { id: 't5-2', date: '2026-05-20', location: 'Glen Waverley VIC', fuelType: 'Petrol', litres: 48.7, pricePerLitre: 1.86, amount: 90.58 },
      { id: 't5-3', date: '2026-05-13', location: 'Box Hill VIC', fuelType: 'Petrol', litres: 51.5, pricePerLitre: 1.90, amount: 97.85 },
      { id: 't5-4', date: '2026-05-06', location: 'Ringwood VIC', fuelType: 'Petrol', litres: 49.8, pricePerLitre: 1.87, amount: 93.13 },
      { id: 't5-5', date: '2026-04-29', location: 'Glen Waverley VIC', fuelType: 'Petrol', litres: 52.3, pricePerLitre: 1.85, amount: 96.76 },
      { id: 't5-6', date: '2026-04-22', location: 'Ringwood VIC', fuelType: 'Petrol', litres: 50.6, pricePerLitre: 1.89, amount: 95.63 },
    ],
  },
  {
    id: '6',
    cardNumber: '**** **** **** 2156',
    last4: '2156',
    status: 'suspended',
    driver: { name: 'Lisa Chen' },
    vehicle: { numberPlate: 'MNO-678', make: 'Hyundai', model: 'Tucson', year: 2022 },
    monthlySpendingLimit: 800,
    fuelType: 'any',
    pinStatus: 'not_set',
    issuedDate: '2023-09-14',
    transactions: [
      { id: 't6-1', date: '2026-04-15', location: 'Oakleigh VIC', fuelType: 'Petrol', litres: 42.0, pricePerLitre: 1.87, amount: 78.54 },
      { id: 't6-2', date: '2026-04-02', location: 'Clayton VIC', fuelType: 'Petrol', litres: 44.5, pricePerLitre: 1.85, amount: 82.33 },
      { id: 't6-3', date: '2026-03-20', location: 'Oakleigh VIC', fuelType: 'Petrol', litres: 43.1, pricePerLitre: 1.86, amount: 80.17 },
    ],
  },
]

export function getCurrentMonthSpend(card: FleetCard): number {
  const prefix = new Date().toISOString().slice(0, 7)
  return card.transactions
    .filter(t => t.date.startsWith(prefix))
    .reduce((sum, t) => sum + t.amount, 0)
}

export function getTotalMonthlySpend(): number {
  return cards.reduce((sum, card) => sum + getCurrentMonthSpend(card), 0)
}
