export type CardStatus = 'active' | 'inactive' | 'suspended'
export type FuelType = 'any' | 'diesel' | 'petrol'
export type PinStatus = 'set' | 'not_set' | 'locked'

export interface Transaction {
  id: string
  date: string
  location: string
  fuelType: string
  litres: number
  pricePerLitre: number
  amount: number
}

export interface FleetCard {
  id: string
  cardNumber: string
  last4: string
  status: CardStatus
  driver: {
    name: string
    photo?: string
  }
  vehicle: {
    numberPlate: string
    make: string
    model: string
    year: number
  }
  monthlySpendingLimit: number
  fuelType: FuelType
  pinStatus: PinStatus
  transactions: Transaction[]
  issuedDate: string
}
