import { NextResponse } from 'next/server'
import PdfParse from 'pdf-parse';

export const config = {
  api: {
    bodyParser: false, // ปิด bodyParser ของ Next.js เพื่อให้ multiparty จัดการแทน
  },
};

const API_KEY = process.env.API_KEY
const GEMINI_URL = process.env.GEMINI_URL

export async function GET() {

  return NextResponse.json({
    "data": [
      {
        "number": 1,
        "question": "กรดนิวคลีอิกชนิดใดที่พบเฉพาะในนิวเคลียส, ไมโตคอนเดรีย และคลอโรพลาสต์ของเซลล์ยูคาริโอต?",
        "choices": ["mRNA", "tRNA", "rRNA", "DNA", "snRNA"],
        "answer": 3
      },
      {
        "number": 2,
        "question": "พันธะเคมีชนิดใดที่เชื่อมต่อระหว่างนิวคลีโอไทด์ในสาย DNA?",
        "choices": ["พันธะไฮโดรเจน", "พันธะไอออนิก", "พันธะโคเวเลนต์", "พันธะเพปไทด์", "Phosphodiester bond"],
        "answer": 4
      },
      {
        "number": 3,
        "question": "เบสชนิดใดที่ไม่พบใน RNA แต่พบใน DNA?",
        "choices": ["อะดีนีน", "กวานีน", "ไซโตซีน", "ยูราซิล", "ไทมีน"],
        "answer": 4
      },
      {
        "number": 4,
        "question": "RNA ชนิดใดที่มีปริมาณมากที่สุดในเซลล์?",
        "choices": ["mRNA", "tRNA", "rRNA", "snRNA", "miRNA"],
        "answer": 2
      },
      {
        "number": 5,
        "question": "ข้อใดคือความแตกต่างระหว่าง DNA และ RNA?",
        "choices": ["DNA เป็นสายเดี่ยว, RNA เป็นสายคู่", "DNA มีน้ำตาลไรโบส, RNA มีน้ำตาลดีออกซีไรโบส", "DNA มีเบสยูราซิล, RNA มีเบสไทมีน", "DNA มีขนาดใหญ่กว่า RNA", "DNA พบได้เฉพาะในนิวเคลียส, RNA พบได้ทั่วเซลล                         ล์"],
        "answer": 3
      },
      {
        "number": 6,
        "question": "กระบวนการใดในหลักการกลางของชีววิทยาโมเลกุลที่เกี่ยวข้องกับการสร้าง RNA จาก DNA?",
        "choices": ["DNA Replication", "Transcription", "Translation", "Reverse transcription", "Transformation"],
        "answer": 1
      },
      {
        "number": 7,
        "question": "เอนไซม์ชนิดใดที่ใช้ในกระบวนการ Reverse transcription?",
        "choices": ["DNA polymerase", "RNA polymerase", "Reverse transcriptase", "Ligase", "Helicase"],
        "answer": 2
      },
      {
        "number": 8,
        "question": "กระบวนการใดที่เกี่ยวข้องกับการสร้างโปรตีนจาก mRNA?",
        "choices": ["DNA Replication", "Transcription", "Translation", "Reverse transcription", "Transformation"],
        "answer": 2
      },
      {
        "number": 9,
        "question": "ข้อใดคือความหมายของคำว่า 'ฟีโนไทป์'?",
        "choices": ["ส่วนผสมของแอลลีล", "รูปแบบของยีน", "ลักษณะที่ปรากฏ", "ลำดับเบสใน DNA", "ชนิดของโปรตีน"],
        "answer": 2
      },
      {
        "number": 10,
        "question": "บุคคลใดได้รับการยกย่องว่าเป็นบิดาแห่งพันธุศาสตร์?",
        "choices": ["Charles Darwin", "James Watson", "Francis Crick", "Gregor Mendel", "Rosalind Franklin"],
        "answer": 3
      },
      {
        "number": 11,
        "question": "กฎข้อใดของเมนเดลที่กล่าวถึงการแยกตัวของยีน?",
        "choices": ["กฎแห่งการรวมกลุ่มอย่างอิสระ", "กฎแห่งการถ่ายทอดลักษณะ", "กฎแห่งการข่ม", "กฎแห่งการแยก", "กฎแห่งความน่าจะเป็น"],
        "answer": 3
      },
      {
        "number": 12,
        "question": "กฎข้อใดของเมนเดลที่กล่าวถึงการรวมกลุ่มของยีนอย่างอิสระ?",
        "choices": ["กฎแห่งการรวมกลุ่มอย่างอิสระ", "กฎแห่งการถ่ายทอดลักษณะ", "กฎแห่งการข่ม", "กฎแห่งการแยก", "กฎแห่งความน่าจะเป็น"],
        "answer": 0
      },
      {
        "number": 13,
        "question": "จีโนไทป์มีผลต่อฟีโนไทป์อย่างไร? (วิเคราะห์)",
        "choices": ["จีโนไทป์กำหนดฟีโนไทป์โดยตรง", "ฟีโนไทป์กำหนดจีโนไทป์", "จีโนไทป์และสภาพแวดล้อมร่วมกันกำหนดฟีโนไทป์", "จีโนไทป์ไม่มีผลต่อฟีโนไทป์", "ฟีโนไทป์เป็นเพียงความบังเอิญ"],
        "answer": 2
      },
      {
        "number": 14,
        "question": "การจำลอง DNA มีความสำคัญอย่างไรต่อการดำรงชีวิตของสิ่งมีชีวิต? (วิเคราะห์)",
        "choices": ["ทำให้เกิดความหลากหลายทางพันธุกรรม", "ทำให้สิ่งมีชีวิตมีขนาดใหญ่ขึ้น", "ทำให้สิ่งมีชีวิตสามารถเคลื่อนที่ได้", "ทำให้สิ่งมีชีวิตสามารถสืบพันธุ์และถ่ายทอดข้อมูลทางพันธุกรรมได้", "ทำให้สิ่งมีชีว                                             วิตสามารถปรับตัวเข้ากับสภาพแวดล้อมได้"],
        "answer": 3
      },
      {
        "number": 15,
        "question": "ข้อใดคือความแตกต่างที่สำคัญระหว่างแอลลีลเด่นและแอลลีลด้อย?",
        "choices": ["แอลลีลเด่นจะแสดงลักษณะเมื่อมีแอลลีลนั้นเพียงตัวเดียว, แอลลีลด้อยจะแสดงลักษณะเมื่อมีแอลลีลนั้นเพียงตัวเดียว", "แอลลีลเด่นจะแสดงลักษณะเมื่อมีแอลลีลนั้นสองตัว, แอลลีลด้อยจะแสดงลักษณะเมื่อมีแอลล                                       ลีลนั้นสองตัว", "แอลลีลเด่นจะอยู่บนโครโมโซมเพศ, แอลลีลด้อยจะอยู่บนออโตโซม", "แอลลีลเด่นจะทำให้เกิดโรคทางพันธุกรรม, แอลลีลด้อยจะไม่ทำให้เกิดโรคทางพันธุกรรม", "แอลลีลเด่นมีขนาดใหญ่กว่าแอลลีลด้อย"],
        "answer": 0
      }
    ]
  })
}

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 })
  }

  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  // อ่านข้อความจาก PDF ด้วย pdf-parse
  const pdfData = await PdfParse(buffer)
  let fullText = pdfData.text

  const maxChars = 15000
  if (fullText.length > maxChars) {
    fullText = fullText.substring(0, maxChars)
  }

  const prompt = `
ฉันจะโยนสไลน์ให้แล้วอยากให้ช่วยสรุปข้อมูลออกมาเป็นคำถามตอบเกี่ยวกับวิชา ชีวะ
เป็นข้อมูล json มีเลขข้อ คำถาม choice 5 ข้อ และเฉลย เป็นเลขใน list
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
    return NextResponse.json({ data: parsed })
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON format from LLM', raw: rawText })
  }
}
