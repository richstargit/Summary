"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
type Data = {
  title: string;
  _id: string;
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSend, setisSend] = useState(false);
  const [data, setData] = useState<Data[]>();
  const [loading, setloading] = useState<boolean>(true);
  const GetQuestions = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/questions`
      );
      console.log("FULL RESPONSE:", res.data); 
      const questions = res.data.body;
      if (Array.isArray(questions)) {
        setData(questions);
      } else {
        console.error("Expected array but got:", questions);
        setData([]);
      }
    } catch (e) {
      console.error("Error fetching questions:", e);
      setData([]);
    } finally {
      setloading(false);
    }
  };
  useEffect(() => {
    GetQuestions();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile && selectedFile.type !== "application/pdf") {
      setError("กรุณาเลือกไฟล์ PDF เท่านั้น");
      setFile(null);
      return;
    }

    setFile(selectedFile || null);
    setError(null);
    setisSend(false);
  };

  const handleUpload = async () => {
    if (!file) return;
    setisSend(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/question`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const data = res.data;
      window.location.href = `/questions/${data.insertedId}`;
    } catch (error: any) {
      let errorMsg = "อัปโหลดไม่สำเร็จ";
      if (error.response?.data?.error) {
        errorMsg += `: ${error.response.data.error}`;
      } else if (error.response?.data?.detail) {
        errorMsg += `: ${error.response.data.detail}`;
      }
      alert(errorMsg);
    } finally {
      setisSend(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-2xl space-y-6">
      {/* Label + File input */}
      <div className="space-y-2">
        <Label
          htmlFor="file"
          className="text-lg font-semibold flex items-center gap-2"
        >
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
      {loading ? (
        <div  className="flex justify-center items-center">
          <div role="status">
            <svg
              aria-hidden="true"
              className="inline w-30 h-30 text-gray-200 animate-spin dark:text-gray-600 fill-pink-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {data ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                📚 รายการคำถามที่ได้:
              </h3>
              {data?.map((item, idx) => (
                <Link
                  key={idx}
                  href={`/questions/${item._id}`}
                  className="block p-4 rounded-xl shadow-sm border border-gray-200 hover:bg-blue-50 transition"
                >
                  <h2 className="text-base font-medium text-blue-700 hover:underline">
                    {item.title}
                  </h2>
                </Link>
              ))}
            </div>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );
}
