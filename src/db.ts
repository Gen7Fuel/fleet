import { MongoClient, type Db } from 'mongodb'

const uri = process.env.MONGO_URI ?? 'mongodb://mongo:27017/thehub'
const client = new MongoClient(uri)
let db: Db | null = null

export async function getDb(): Promise<Db> {
  if (!db) {
    await client.connect()
    db = client.db('thehub')
  }
  return db
}
