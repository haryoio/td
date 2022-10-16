import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const userRouter = router({
    getAll: publicProcedure
        .query(({ ctx }) => {

            const res = ctx.prisma.user.findMany(
                {
                    where: {
                        private: false
                    },
                    include: {
                        Todo: true
                    }
                }
            )
            console.log(res)
            return res
        }),
    getById: publicProcedure.input(z.object({
        userId: z.string()
    }).required()).query(({ input, ctx }) => {
        return ctx.prisma.user.findFirst({
            where: {
                id: input.userId
            }
        })
    })

})
