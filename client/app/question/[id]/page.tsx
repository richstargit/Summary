'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import CardQuestion from '@/components/ui/CardQuestion'
import { Button } from '@/components/ui/button'

type Question = {
  number: number
  question: string
  choices: string[]
  answer: number
}

type Data = {
    title: string,
    summary:string,
    data : Question[]
}

export default function QuestionPage() {
  const params = useParams<{ id: string }>()
  const id_question = params?.id ?? ''

    const [showAnswer,setShowAnswer] = useState(false)
    const [data, setData] = useState<Data>()
    useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/question/${id_question}`)
      .then(res => res.json())
      .then(json => {
        if (json.status === 200) {
          setData(json.body)
        } else {
          console.error("เกิดข้อผิดพลาด: status != 200", json)
        }
      }).catch(err => console.error("Fetch error:", err))
  }, [])

  return (
    <div>
      <h1 className="text-center text-3xl font-bold tracking-tight text-primary mt-8">
        🧬 Question #{data?.title}
      </h1>
      <Button className='mx-auto block mt-4 mb-5'>Show Summary</Button>
      {data?.data.map((d, index) => {
        return <div key={index} className='mt-5 mb-5'><CardQuestion showAnswer={showAnswer} data={d}></CardQuestion></div>
      })}
      <Button className='mx-auto block mt-4 mb-35' onClick={() => setShowAnswer(true)}>
        Show Answer
      </Button>
    </div>
  )
}
