import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import "@/config/db.setup";
import { logger } from "@chneau/elysia-logger";
import { swagger } from "@elysiajs/swagger";
import { jwt } from "@elysiajs/jwt";
import { QuestionsRoute } from "@/router/questions.router"
import { TemplateRoute } from "@/router/template.router";
import { AccountRoute } from "@/router/accounts.router";
/**
 * @comment Create a new Elysia app
 */
const app = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.SECRET_JWT || 'hex',
    })
  )
  .use(
    swagger({
      path: "/api/docs",
      documentation: {
        info: {
          title: "Summary Documentation",
          version: "1.0.0",
        },
      },
    })
  )
  .use(logger())
  .use(cors())
  .use(TemplateRoute)
  .use(AccountRoute)
  .use(QuestionsRoute)
  .get("/", () =>{
    return {message: "Hello, Elysia! by HEX CODE"};
  })
  .listen(process.env.SERVER_PORT || 3001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
