// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { exampleRouter } from "./example";
import { authRouter } from "./auth";
import { todoRouter } from "./todo"
import { userRouter } from "./user"

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  todo: todoRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
