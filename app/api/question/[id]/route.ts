import { NextRequest, NextResponse } from 'next/server'

type Params = {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = params

  // ทำงานกับ id ได้เลย
  return NextResponse.json({ message: `คุณส่ง id: ${id}` })
}
