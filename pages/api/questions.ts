import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
const pdf = require('pdf-extraction')

export const config = {
  api: {
    bodyParser: false,
  },
}

const API_KEY = process.env.API_KEY
const GEMINI_URL = process.env.GEMINI_URL

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { id } = req.query

    if (typeof id !== 'string' || !ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid or missing id' })
    }

    try {
      const client = await clientPromise
      const db = client.db('Summary')
      const item = await db.collection('questions').findOne({ _id: new ObjectId(id) })

      if (!item) {
        return res.status(404).json({ error: 'Item not found' })
      }

      return res.status(200).json(item)
    } catch (error) {
      console.error('GET /api/questions error:', error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  if (req.method === 'POST') {
    const multiparty = (await import('multiparty')).default
    const form = new multiparty.Form()

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({ error: 'File upload failed' })
      }

      const file = files.file?.[0]
      if (!file || !file.path.endsWith('.pdf')) {
        return res.status(400).json({ error: 'Missing or invalid PDF file' })
      }

      const fs = await import('fs/promises')
      const buffer = await fs.readFile(file.path)
      const data = await pdf(buffer)
      let fullText = data.text || ''

      const maxChars = 15000
      if (fullText.length > maxChars) {
        fullText = fullText.substring(0, maxChars)
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
      const start = rawText.indexOf('{')
      const end = rawText.lastIndexOf('}')
      if (start === -1 || end === -1) {
        return res.status(500).json({ error: 'Failed to parse response', raw: rawText })
      }

      try {
        const parsed = JSON.parse(rawText.substring(start, end + 1))
        const client = await clientPromise
        const db = client.db('Summary')
        const collection = db.collection('questions')
        const result = await collection.insertOne({ data: parsed.data })

        return res.status(200).json({ insertedId: result.insertedId })
      } catch (e) {
        return res.status(500).json({ error: 'Invalid JSON format from LLM', raw: rawText })
      }
    })
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }
}
