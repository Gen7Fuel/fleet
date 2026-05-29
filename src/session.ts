import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import type { Context } from 'hono'

interface Session {
  username: string
  company: string
  customerId: string
  createdAt: number
}

export interface SessionData {
  username: string
  company: string
  customerId: string
}

const sessions = new Map<string, Session>()
const SESSION_TTL = 24 * 60 * 60 * 1000

export function createSession(c: Context, username: string, company: string, customerId: string): void {
  const id = crypto.randomUUID()
  sessions.set(id, { username, company, customerId, createdAt: Date.now() })
  setCookie(c, 'fleet_session', id, {
    httpOnly: true,
    path: '/',
    maxAge: 86400,
    sameSite: 'Strict',
  })
}

export function getSession(c: Context): SessionData | null {
  const id = getCookie(c, 'fleet_session')
  if (!id) return null
  const session = sessions.get(id)
  if (!session) return null
  if (Date.now() - session.createdAt > SESSION_TTL) {
    sessions.delete(id)
    return null
  }
  return { username: session.username, company: session.company, customerId: session.customerId }
}

export function destroySession(c: Context): void {
  const id = getCookie(c, 'fleet_session')
  if (id) sessions.delete(id)
  deleteCookie(c, 'fleet_session', { path: '/' })
}
