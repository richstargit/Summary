'use client'
import Link from "next/link";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UploadCloud } from "lucide-react"
import { useEffect, useState } from "react";

type Data = {
    title: string,
    id : string
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSend, setisSend] = useState(false)
  const [data,setData] = useState<Data[]>()

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/questions`)
      .then(res => res.json())
      .then(json => {
      if (json.status === 200) {
        setData(json.body)
      } else {
        console.error("เกิดข้อผิดพลาด: status != 200", json)
      }
    }).catch(err => console.error("Fetch error:", err))
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]

    if (selectedFile && selectedFile.type !== "application/pdf") {
      setError("กรุณาเลือกไฟล์ PDF เท่านั้น")
      setFile(null)
      return
    }

    setFile(selectedFile || null)
    setError(null)
    setisSend(false)
  }

  const handleUpload = async () => {
    if (!file) return
    setisSend(true)

    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/question`, {
    method: 'POST',
    body: formData,
  })
  setisSend(false)

    if (!res.ok) {
      // ลองอ่าน JSON จาก response เพื่อนำ error message มาแสดง
      let errorMsg = "อัปโหลดไม่สำเร็จ";
      try {
        const errorData = await res.json();
        if (errorData.error) errorMsg += `: ${errorData.error}`;
        else if (errorData.detail) errorMsg += `: ${errorData.detail}`;
      } catch {
        // ถ้า parse json ไม่ได้ ก็ไม่ต้องทำอะไร
      }
      alert(errorMsg);
      return;
    }

    const data = await res.json()
    if(!data.body){
      alert("error");
    }
    window.location.href = `/questions/${data.body.insertedId}`;
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-2xl space-y-6">
      {/* Label + File input */}
      <div className="space-y-2">
        <Label htmlFor="file" className="text-lg font-semibold flex items-center gap-2">
          📄 เลือกไฟล์ PDF
        </Label>
        <Input
          id="file"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {file && <p className="text-sm text-gray-600">ไฟล์: {file.name}</p>}
      </div>

      {/* Upload Button */}
      <Button
        onClick={handleUpload}
        disabled={!file || isSend}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 transition-transform text-white"
      >
        <UploadCloud className="w-4 h-4 mr-2" />
        อัปโหลด PDF
      </Button>

      {/* List of uploaded questions */}
      {data?(
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">📚 รายการคำถามที่ได้:</h3>
          {data?.map((item, idx) => (
            <Link
              key={idx}
              href={`/questions/${item.id}`}
              className="block p-4 rounded-xl shadow-sm border border-gray-200 hover:bg-blue-50 transition"
            >
              <h2 className="text-base font-medium text-blue-700 hover:underline">{item.title}</h2>
            </Link>
          ))}
        </div>
      ):<></>}
    </div>
  );
}
