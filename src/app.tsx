/** @jsxImportSource hono/jsx */
import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import bcrypt from 'bcryptjs'
import { ObjectId } from 'mongodb'
import { createSession, getSession, destroySession } from './session'
import { getDb } from './db'
import { LoginPage } from './components/LoginPage'
import { DashboardPage } from './components/DashboardPage'
import { CardDetailPage } from './components/CardDetailPage'
import type { FleetCard, CardStatus, PinStatus } from './types'

const CDN_UPLOAD = 'https://app.gen7fuel.com/cdn/upload'
const CDN_BASE   = 'https://app.gen7fuel.com/cdn/download'

type Variables = { username: string; company: string }

const app = new Hono<{ Variables: Variables }>()

app.use('/static/*', serveStatic({ root: './' }))

function docToCard(doc: any): FleetCard {
  return {
    id: doc._id.toString(),
    fleetCardNumber: String(doc.fleetCardNumber ?? ''),
    status: (doc.status ?? 'active') as CardStatus,
    driverName: String(doc.driverName ?? ''),
    driverPhoto: doc.driverPhoto ? String(doc.driverPhoto) : undefined,
    vehicleMakeModel: String(doc.vehicleMakeModel ?? ''),
    numberPlate: String(doc.numberPlate ?? ''),
    customerName: String(doc.customerName ?? ''),
    customerId: String(doc.customerId ?? ''),
    site: String(doc.site ?? ''),
    notes: String(doc.notes ?? ''),
    pinStatus: (doc.pinStatus ?? 'not_set') as PinStatus,
    issuedDate: doc.createdAt ? new Date(doc.createdAt).toISOString().slice(0, 10) : undefined,
    transactions: [],
  }
}

async function loadCards(customerName: string): Promise<FleetCard[]> {
  const db = await getDb()
  const docs = await db.collection('fleets').find({ customerName }).toArray()
  return docs.map(docToCard)
}

async function loadCard(id: string): Promise<FleetCard | null> {
  try {
    const db = await getDb()
    const doc = await db.collection('fleets').findOne({ _id: new ObjectId(id) })
    return doc ? docToCard(doc) : null
  } catch {
    return null
  }
}

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
    const account = await db.collection('fleetcustomers').findOne({ username })

    console.log('[login] username:', username, '| account found:', !!account)
    if (account && await bcrypt.compare(password, String(account.password))) {
      createSession(c, String(account.username), String(account.name))
      return c.redirect('/dashboard')
    }
    if (account) console.log('[login] password mismatch')
  } catch (err) {
    console.error('[login] DB error:', err)
  }

  return c.redirect('/?error=1')
})

// Logout
app.get('/logout', (c) => {
  destroySession(c)
  return c.redirect('/')
})

// Dashboard
app.get('/dashboard', requireAuth, async (c) => {
  const cards = await loadCards(c.get('company'))
  return c.html(
    <DashboardPage
      username={c.get('username')}
      company={c.get('company')}
      cards={cards}
    />
  )
})

// Card detail
app.get('/cards/:id', requireAuth, async (c) => {
  const card = await loadCard(c.req.param('id'))
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
  const id = c.req.param('id')
  const card = await loadCard(id)
  if (!card) return c.redirect('/dashboard')

  const body = await c.req.parseBody()
  const update: Record<string, string> = {}

  const driverName = String(body.driverName ?? '').trim()
  if (driverName) update.driverName = driverName

  const numberPlate = String(body.numberPlate ?? '').trim().toUpperCase()
  if (numberPlate) update.numberPlate = numberPlate

  const vehicleMakeModel = String(body.vehicleMakeModel ?? '').trim()
  if (vehicleMakeModel) update.vehicleMakeModel = vehicleMakeModel

  try {
    const db = await getDb()
    await db.collection('fleets').updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    )
  } catch (err) {
    console.error('[card update] DB error:', err)
  }

  return c.redirect(`/cards/${id}?saved=1`)
})

// Upload driver photo
app.post('/cards/:id/upload-photo', requireAuth, async (c) => {
  const id = c.req.param('id')
  const card = await loadCard(id)
  if (!card) return c.redirect('/dashboard')

  const body = await c.req.parseBody()
  const file = body['photo']

  if (!file || !(file instanceof File) || file.size === 0) {
    return c.redirect(`/cards/${id}`)
  }

  try {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch(CDN_UPLOAD, { method: 'POST', body: formData })
    if (!res.ok) throw new Error('CDN error')
    const { filename } = await res.json() as { filename: string }
    const fileId = filename.replace(/\.[^/.]+$/, '')
    const photoUrl = `${CDN_BASE}/${fileId}`
    const db = await getDb()
    await db.collection('fleets').updateOne(
      { _id: new ObjectId(id) },
      { $set: { driverPhoto: photoUrl } }
    )
    return c.redirect(`/cards/${id}?saved=1`)
  } catch {
    return c.redirect(`/cards/${id}?uploadError=1`)
  }
})

// Remove driver photo
app.post('/cards/:id/remove-photo', requireAuth, async (c) => {
  const id = c.req.param('id')
  try {
    const db = await getDb()
    await db.collection('fleets').updateOne(
      { _id: new ObjectId(id) },
      { $unset: { driverPhoto: '' } }
    )
  } catch (err) {
    console.error('[remove-photo] DB error:', err)
  }
  return c.redirect(`/cards/${id}?saved=1`)
})

// Toggle active/inactive
app.post('/cards/:id/toggle-status', requireAuth, async (c) => {
  const id = c.req.param('id')
  const card = await loadCard(id)
  if (!card || !['active', 'inactive'].includes(card.status)) return c.redirect('/dashboard')
  const newStatus = card.status === 'active' ? 'inactive' : 'active'
  try {
    const db = await getDb()
    await db.collection('fleets').updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: newStatus } }
    )
  } catch (err) {
    console.error('[toggle-status] DB error:', err)
  }
  return c.redirect(`/cards/${id}`)
})

export default app
