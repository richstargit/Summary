import { Elysia } from 'elysia';


export const TemplateRoute = new Elysia({ prefix: '/template' })
    .get('/test', async ({}) => {

         
      return {
        status: 200,
        message: "Template success1",
      }
    });