import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import  Params  from 'next/dist/server/request/params';
import { NextResponse } from 'next/server'

export async function GET(req: Request,
  { params }: { params: { id: string } }) {
  try {
    const {id} =  await params
    const client = await clientPromise;
    const db = client.db('Summary');

    const item = await db.collection('questions').findOne({ _id: new ObjectId(id) });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}