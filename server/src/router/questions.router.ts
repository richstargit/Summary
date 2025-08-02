import { Question } from '@/service/question.service';
import { Elysia } from 'elysia';


export const QuestionsRoute = new Elysia({})
    .get('question/:id', Question);