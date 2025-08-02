"use client";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type Question = {
  number: number;
  question: string;
  choices: string[];
  answer: number;
  explanation?: string;
};

interface Props {
  data: Question;
  onAnswered?: (isCorrect: boolean) => void;
  showAnswer: boolean
}

export default function CardQuestion({ data, onAnswered,showAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  
  return (
    <Card className="w-full max-w-xl mx-auto shadow-xl p-4">
      <CardHeader>
        <h2 className="text-xl font-bold">ข้อ {data.number}</h2>
        <p className="text-lg mt-2">{data.question}</p>
      </CardHeader>

      <CardContent className="space-y-3">
        {data.choices.map((choice, idx) => (
          <Button
            key={idx}
            variant={selected === idx ? "default" : "outline"}
            className={`w-full justify-start break-normal whitespace-normal text-left p-10 ${
              showAnswer? idx === data.answer
                ? selected === idx?"bg-green-500":"border-green-500 text-green-600"
                : selected === idx?"bg-red-500":"border-red-500 text-red-600" :""
            }`}
            onClick={() => idx!=selected? setSelected(idx):setSelected(null)}
            disabled={showAnswer}
          >
            {choice}
          </Button>
        ))}
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-2 mt-4">
        {!showAnswer ? (
          <></>
        ) : (
          <>
            <p className="text-sm text-gray-700">
              ✅ คำตอบที่ถูกต้องคือ: <b>{data.choices[data.answer]}</b>
            </p>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
