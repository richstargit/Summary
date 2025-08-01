import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'
type ParamsContext = {
  params: {
    id: string
  }
}
export async function GET(request:Request, { params }:ParamsContext// ✅ รับ context แล้วใช้ด้านใน
) {
  try {
    const {id} = await params       // ✅ ไม่ต้อง await
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
