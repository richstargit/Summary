import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'

export async function GET(req: Request
) {
  try {
    const id = 1 // ✅ ไม่ต้อง await
    const client = await clientPromise
    const db = client.db('Summary')

    const item = await db.collection('questions').findOne({ _id: new ObjectId(id) })

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error('GET /api/questions/[id] error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
