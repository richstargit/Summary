import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import  Params  from 'next/dist/server/request/params';
import { NextResponse } from 'next/server'

const pdf = require('pdf-extraction');

export const config = {
  api: {
    bodyParser: false, // ปิด bodyParser ของ Next.js เพื่อให้ multiparty จัดการแทน
  },
};

const API_KEY = process.env.API_KEY
const GEMINI_URL = process.env.GEMINI_URL


export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  let data1 = "1"
  if (!file) {
    return new Response(JSON.stringify({ error: "Missing file" }), { status: 400 });
  }

  if (file.type !== "application/pdf") {
    return new Response(JSON.stringify({ error: "Only PDF files are allowed" }), { status: 400 });
  }

  // เพิ่มเติม: เช็กชื่อไฟล์ว่า .pdf ไหม (ถ้าอยากเช็กซ้ำ)
  if (!file.name.endsWith(".pdf")) {
    return new Response(JSON.stringify({ error: "Invalid file extension" }), { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());


  const data = await pdf(buffer);
  let fullText = data.text || "";

  const maxChars = 15000;
  if (fullText.length > maxChars) {
    fullText = fullText.substring(0, maxChars);
  }

  const prompt = `
ฉันจะโยนสไลน์ให้แล้วอยากให้ช่วยสรุปข้อมูลออกมาเป็นคำถามตอบเกี่ยวกับวิชา ชีวะ
เป็นข้อมูล json มีเลขข้อ คำถาม choice 5 ข้อ และเฉลย เป็นเลขลำดับใน choice list เท่านั้น 0-4
ต้องทำทั้งหมด 15 ข้อ ออกมาเป็น list ของตัวแปรชื่อ data : []
อยากให้ มี ข้อที่ต้องวิเคราะห์ 2 ข้อ
ตัวอย่าง 1 ชุด รูปแบบ json เท่านั้น
data : [ 
  {
    number: 1,
    question: "เซลล์ใดเป็นเซลล์ของสิ่งมีชีวิต?",
    choices: ["เซลล์แสง", "เซลล์กล้ามเนื้อ", "เซลล์หิน", "เซลล์ลม", "เซลล์เสียง"],
    answer: 1 
  },
  ...
];

ข้อมูลสไลด์:
${fullText}
`

  const response = await fetch(`${GEMINI_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  })

  const json = await response.json()
  const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text || ''

  // ดึงเฉพาะ JSON ส่วนที่เริ่มจาก [ และจบด้วย ]
  const start = rawText.indexOf('{')
  const end = rawText.lastIndexOf('}')
  if (start === -1 || end === -1) {
    return NextResponse.json({ error: 'Failed to parse response', raw: rawText })
  }

  try {
    const parsed = JSON.parse(rawText.substring(start, end + 1))
    const client = await clientPromise;
    const db = client.db('Summary'); // เปลี่ยนชื่อ database ตามจริง
    const collection = db.collection('questions'); // ชื่อ collection คือ 'data'

    // Insert ในรูปแบบ { data: parsed }
    const result = await collection.insertOne({ data: parsed.data });

    return NextResponse.json({ insertedId: result.insertedId });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON format from LLM', raw: rawText })
  }
}
