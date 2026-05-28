/** @jsxImportSource hono/jsx */
import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import bcrypt from 'bcryptjs'
import { createSession, getSession, destroySession } from './session'
import { getDb } from './db'
import { cards, getTotalMonthlySpend } from './data/demo'
import { LoginPage } from './components/LoginPage'
import { DashboardPage } from './components/DashboardPage'
import { CardDetailPage } from './components/CardDetailPage'
import type { FuelType } from './types'

const CDN_UPLOAD = 'https://app.gen7fuel.com/cdn/upload'
const CDN_BASE   = 'https://app.gen7fuel.com/cdn/download'

type Variables = { username: string; company: string }

const app = new Hono<{ Variables: Variables }>()

app.use('/static/*', serveStatic({ root: './' }))

async function requireAuth(c: any, next: any) {
  const session = getSession(c)
  if (!session) return c.redirect('/')
  c.set('username', session.username)
  c.set('company', session.company)
  await next()
}

// Login page
app.get('/', (c) => {
  if (getSession(c)) return c.redirect('/dashboard')
  const error = c.req.query('error') === '1'
  return c.html(<LoginPage error={error} />)
})

// Login submit
app.post('/login', async (c) => {
  const body = await c.req.parseBody()
  const username = String(body.username ?? '').trim().toLowerCase()
  const password = String(body.password ?? '')

  try {
    const db = await getDb()
    const account = await db
      .collection('fleetcustomers')
      .findOne({ username })

    if (account && await bcrypt.compare(password, String(account.password))) {
      createSession(c, String(account.username), String(account.name))
      return c.redirect('/dashboard')
    }
  } catch {
    // DB unavailable — fall through to error redirect
  }

  return c.redirect('/?error=1')
})

// Logout
app.get('/logout', (c) => {
  destroySession(c)
  return c.redirect('/')
})

// Dashboard
app.get('/dashboard', requireAuth, (c) => {
  return c.html(
    <DashboardPage
      username={c.get('username')}
      company={c.get('company')}
      cards={cards}
      totalMonthlySpend={getTotalMonthlySpend()}
    />
  )
})

// Card detail
app.get('/cards/:id', requireAuth, (c) => {
  const card = cards.find(card => card.id === c.req.param('id'))
  if (!card) return c.redirect('/dashboard')
  return c.html(
    <CardDetailPage
      username={c.get('username')}
      company={c.get('company')}
      card={card}
      saved={c.req.query('saved') === '1'}
      uploadError={c.req.query('uploadError') === '1'}
    />
  )
})

// Update card fields
app.post('/cards/:id', requireAuth, async (c) => {
  const card = cards.find(card => card.id === c.req.param('id'))
  if (!card) return c.redirect('/dashboard')

  const body = await c.req.parseBody()

  card.driver.name = String(body.driverName ?? card.driver.name).trim()
  card.vehicle.numberPlate = String(body.numberPlate ?? card.vehicle.numberPlate).trim().toUpperCase()
  card.vehicle.make = String(body.vehicleMake ?? card.vehicle.make).trim()
  card.vehicle.model = String(body.vehicleModel ?? card.vehicle.model).trim()

  const year = parseInt(String(body.vehicleYear ?? ''))
  if (!isNaN(year) && year >= 1980 && year <= 2030) card.vehicle.year = year

  const limit = parseFloat(String(body.spendingLimit ?? ''))
  if (!isNaN(limit) && limit > 0) card.monthlySpendingLimit = limit

  const fuel = String(body.fuelType ?? '')
  const validFuels: FuelType[] = ['any', 'diesel', 'petrol']
  if (validFuels.includes(fuel as FuelType)) card.fuelType = fuel as FuelType

  return c.redirect(`/cards/${card.id}?saved=1`)
})

// Upload driver photo
app.post('/cards/:id/upload-photo', requireAuth, async (c) => {
  const card = cards.find(card => card.id === c.req.param('id'))
  if (!card) return c.redirect('/dashboard')

  const body = await c.req.parseBody()
  const file = body['photo']

  if (!file || !(file instanceof File) || file.size === 0) {
    return c.redirect(`/cards/${card.id}`)
  }

  try {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch(CDN_UPLOAD, { method: 'POST', body: formData })
    if (!res.ok) throw new Error('CDN error')
    const { filename } = await res.json() as { filename: string }
    const id = filename.replace(/\.[^/.]+$/, '')
    card.driver.photo = `${CDN_BASE}/${id}`
    return c.redirect(`/cards/${card.id}?saved=1`)
  } catch {
    return c.redirect(`/cards/${card.id}?uploadError=1`)
  }
})

// Remove driver photo
app.post('/cards/:id/remove-photo', requireAuth, (c) => {
  const card = cards.find(card => card.id === c.req.param('id'))
  if (!card) return c.redirect('/dashboard')
  card.driver.photo = undefined
  return c.redirect(`/cards/${card.id}?saved=1`)
})

// Toggle active/inactive
app.post('/cards/:id/toggle-status', requireAuth, (c) => {
  const card = cards.find(card => card.id === c.req.param('id'))
  if (!card || card.status === 'suspended') return c.redirect('/dashboard')
  card.status = card.status === 'active' ? 'inactive' : 'active'
  return c.redirect(`/cards/${card.id}`)
})

export default app
