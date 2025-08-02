import { Elysia } from "elysia";
import { t } from "elysia";
import { createAccount } from "@/models/accounts.model";

export const AccountRoute = new Elysia({ prefix: "/accounts" }).post(
  "/register",
  async ({ body, set }) => {
    try {
      const { username, email, password } = body;

      const newAccount = await createAccount({
        username,
        email,
        password,
      });

      if (!newAccount) {
        set.status = 400;
        return {
          status: 400,
          message: "Account creation failed",
        };
      }

      return {
        status: 201,
        data: {
          username,
          email,
          password,
        },
      };
    } catch (e) {
      console.log(e);
      set.status = 500;
      return {
        status: 500,
        message: "Internal server error",
      };
    }
  },
  {
    body: t.Object({
      username: t.String(),
      email: t.String(),
      password: t.String(),
    }),
  }
);
