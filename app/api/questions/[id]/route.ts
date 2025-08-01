import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'
 
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params
  const { id } = params
  try {
    // ✅ This is the corrected line based on the new error message
    // You must await params before accessing its properties.
    
    // Check if id is a valid ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }
 
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