export type CardStatus = 'active' | 'inactive' | 'lost' | 'stolen' | 'cancelled'
export type PinStatus = 'set' | 'not_set' | 'locked'

export interface Transaction {
  id: string
  date: string
  stationName: string
  productCode: string
  quantity: number
  amount: number
  source: string
  receipt?: string
}

export interface FleetCard {
  id: string
  fleetCardNumber: string
  status: CardStatus
  driverName: string
  driverPhoto?: string
  vehicleMakeModel: string
  numberPlate: string
  customerName: string
  customerId: string
  site: string
  notes: string
  pinStatus: PinStatus
  issuedDate?: string
  transactions: Transaction[]
}
