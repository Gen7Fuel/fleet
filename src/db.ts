import { MongoClient, type Db } from 'mongodb'

const uri = process.env.MONGO_URI ?? 'mongodb://localhost:27018/main'
const client = new MongoClient(uri)
let db: Db | null = null

export async function getDb(): Promise<Db> {
  if (!db) {
    await client.connect()
    db = client.db(new URL(uri).pathname.slice(1))
  }
  return db
}
