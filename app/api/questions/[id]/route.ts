import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

interface Params {
  params: { id: string }
}

export async function GET(
  req: NextRequest,
  context: Params
) {
  const id = context.params.id

  try {
    const client = await clientPromise
    const db = client.db('Summary')

    const item = await db.collection('questions').findOne({ _id: new ObjectId(id) })

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
