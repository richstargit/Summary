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
    data : Question[]
}

export default function QuestionPage() {
    const { id } = useParams()
    const [showAnswer,setShowAnswer] = useState(false)
    const [data, setData] = useState<Data>()

    useEffect(() => {
    fetch(`/api/questions/${id}`)
      .then(res => res.json())
      .then(setData)
  }, [])

    return (
        <div>
            <h1 className="text-center text-3xl font-bold tracking-tight text-primary mt-8">
  🧬 Question #{id}
</h1>
            {data?.data.map((d,index)=>{
                return <div key={index} className='mt-5 mb-5'><CardQuestion showAnswer={showAnswer} data={d}></CardQuestion></div>
            })}
            <Button className='mx-auto block mt-4 mb-35' onClick={()=>setShowAnswer(true)}>
                Show Answer
            </Button>
        </div>
    )
}
