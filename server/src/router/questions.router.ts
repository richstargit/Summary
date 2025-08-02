import { CreateQuestion, FindQuestion } from '@/service/question.service';
import { Elysia } from 'elysia';


export const QuestionsRoute = new Elysia({prefix:"/api"})
    .get('question/:id', FindQuestion)
    .post("question" , CreateQuestion)