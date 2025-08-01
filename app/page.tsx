'use client'
import Link from "next/link";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UploadCloud } from "lucide-react"
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]

    if (selectedFile && selectedFile.type !== "application/pdf") {
      setError("กรุณาเลือกไฟล์ PDF เท่านั้น")
      setFile(null)
      return
    }

    setFile(selectedFile || null)
    setError(null)
  }

  const handleUpload = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch("/api/questions", {
      method: "POST",
      body: formData,
    })

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
    alert("อัปโหลดสำเร็จ 🎉: " + data)
  }

  return (
    <div>
      
      <Link href={`/questions/1`} className="text-blue-500 underline">
        ไปยังคำถาม
      </Link>
      <Label htmlFor="file" className="block text-lg font-semibold">📄 เลือกไฟล์ PDF</Label>
      <Input id="file" type="file" accept="application/pdf" onChange={handleFileChange} />
      
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {file && <p className="text-sm">ไฟล์: {file.name}</p>}

      <Button
        onClick={handleUpload}
        disabled={!file}
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 transition-all text-white"
      >
        <UploadCloud className="w-4 h-4 mr-2" />
        อัปโหลด PDF
      </Button>
    </div>
  );
}
