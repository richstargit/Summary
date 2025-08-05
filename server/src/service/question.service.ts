import { QuestionsModel } from '@/models/summary.model';
import { ObjectId } from 'mongodb';
const pdf = require('pdf-extraction')
import axios from "axios";
export const FindQuestion = async ({params:{id}} : {params:{id:string}})=>{
  try {
    const item = await QuestionsModel.findOne({ _id: new ObjectId(id) })

    if (!item) {
      return{
        status:400,
        body:{error : "Item not found"}
      }
    }

    //return status(200).json(item)
    return {
      status: 200 ,
      body:item
    }
  } catch (error) {
    console.error('GET /api/questions error:', error)
    return {
      status:500 ,
      body:{error: "Internal Server Error"}
    }
  }
}

export const GetQuestions = async ({})=>{
  try {
    const item = await QuestionsModel.find({})

    if (!item) {
      return{
        status:400,
        body:{error : "Item not found"}
      }
    }

    //return status(200).json(item)
    return {
      status: 200 ,
      body:item.map(item=>{
        return{
          title:item.title,
          id:item._id.toString(),
        }
      })
    }
  } catch (error) {
    console.error('GET /api/questions error:', error)
    return {
      status:500 ,
      body:{error: "Internal Server Error"}
    }
  }
}


export const CreateQuestion = async ({ request }: { request: Request }) => {
  const formData = await request.formData();


  const file = formData.get("file");

  if (!file || !(file instanceof Blob) || !file.type.includes("pdf")) {
    return {
      status: 400,
      body: { error: "Missing or invalid PDF file" }
    };
  }

  try {

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);


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
      มีตัวแปรชื่อ title เอาไว้เก็บหัวข้อเรื่องความยาวไม่เกิน 50 ตัวอักษร
      มีตัวแปรชื่อ summary ให้เก็บสรุปเนื้อหาทำเป็น string ยาวๆ ให้อ่านง่ายใช้ emoji ได้และเนื้อหาต้องถูกต้อง เว้นบรรดทัดให้สวยงาม
      ภาษาของเนื้อหาทั้งหมดให้ดูว่าข้อมูลที่ให้มี ภาษาไทย หรือ อังกฤษ มากกว่ากัน ให้เป็นภาษาที่พบมากที่สุดในเนื้อหา
      ตัวอย่าง 1 ชุด รูปแบบ json เท่านั้น
      title : "ชีวะ",
      summary : "สรุปเนื้อหา...",
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
            `;

    // 7. เรียก API Gemini ด้วย axios
    const response = await axios.post(`${process.env.GEMINI_URL}?key=${process.env.API_KEY}`, {
      contents: [{ parts: [{ text: prompt }] }],
    });

    const json = await response.data;
    const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const start = rawText.indexOf('{');
    const end = rawText.lastIndexOf('}');

    if (start === -1 || end === -1) {
      return {
        status: 500,
        body: { error: 'Failed to parse response', raw: rawText }
      };
    }

    const parsed = JSON.parse(rawText.substring(start, end + 1));

    // 8. บันทึกข้อมูลลงฐานข้อมูล MongoDB ด้วย Mongoose
    const result = await QuestionsModel.create({ title: parsed.title,summary:parsed.summary, data: parsed.data });

    return {
      status: 200,
      body: { insertedId: result._id }
    };
  } catch (e) {
    console.error('POST /api/questions error:', e);
    return {
      status: 500,
      body: { error: e instanceof Error ? e.message : String(e) }
    };
  }
};
