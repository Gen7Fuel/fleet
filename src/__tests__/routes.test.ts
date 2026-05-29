import { mock, beforeAll, describe, it, expect } from 'bun:test'

const makeDb = (findOneResult: any = null, findResult: any[] = []) => ({
  getDb: async () => ({
    collection: () => ({
      findOne: async () => findOneResult,
      find: () => ({ toArray: async () => findResult }),
      updateOne: async () => ({}),
    }),
  }),
})

mock.module('../db', () => makeDb())

mock.module('bcryptjs', () => ({
  default: {
    compare: async () => true,
    genSalt: async () => 'salt',
    hash: async () => 'hashed',
  },
}))

import app from '../app'

describe('GET /', () => {
  it('returns 200 when no session cookie is set', async () => {
    const res = await app.request('http://localhost/')
    expect(res.status).toBe(200)
  })

  it('returns text/html content type', async () => {
    const res = await app.request('http://localhost/')
    expect(res.headers.get('content-type')).toContain('text/html')
  })
})

describe('POST /login with no matching account', () => {
  it('redirects to /?error=1', async () => {
    const body = new URLSearchParams({ username: 'nobody', password: 'wrong' })
    const res = await app.request('http://localhost/login', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })
    expect(res.status).toBe(302)
    expect(res.headers.get('location')).toBe('/?error=1')
  })
})

describe('GET /dashboard with no session', () => {
  it('redirects to /', async () => {
    const res = await app.request('http://localhost/dashboard')
    expect(res.status).toBe(302)
    expect(res.headers.get('location')).toBe('/')
  })
})

describe('GET /cards/nonexistent with no session', () => {
  it('redirects to /', async () => {
    const res = await app.request('http://localhost/cards/nonexistent')
    expect(res.status).toBe(302)
    expect(res.headers.get('location')).toBe('/')
  })
})

async function getSessionCookie(): Promise<string> {
  mock.module('../db', () => makeDb({
    _id: { toString: () => 'test-customer-id' },
    username: 'testuser',
    name: 'Test Company',
    password: '$2b$10$placeholder',
  }))

  const body = new URLSearchParams({ username: 'testuser', password: 'password' })
  const res = await app.request('http://localhost/login', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  mock.module('../db', () => makeDb())

  const cookie = res.headers.get('set-cookie') ?? ''
  return cookie.split(';')[0]
}

describe('authenticated routes', () => {
  let sessionCookie: string

  beforeAll(async () => {
    sessionCookie = await getSessionCookie()
  })

  it('GET /dashboard returns 200', async () => {
    const res = await app.request('http://localhost/dashboard', {
      headers: { cookie: sessionCookie },
    })
    expect(res.status).toBe(200)
  })

  it('GET /cards/nonexistent redirects to /dashboard', async () => {
    const res = await app.request('http://localhost/cards/nonexistent', {
      headers: { cookie: sessionCookie },
    })
    expect(res.status).toBe(302)
    expect(res.headers.get('location')).toBe('/dashboard')
  })
})
