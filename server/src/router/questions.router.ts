import { FindQuestion } from '@/service/question.service';
import { Elysia } from 'elysia';


export const QuestionsRoute = new Elysia({})
    .get('question/:id', FindQuestion);