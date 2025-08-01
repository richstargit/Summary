import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href={`/questions/1`} className="text-blue-500 underline">
        ไปยังคำถาม
      </Link>
    </div>
  );
}
