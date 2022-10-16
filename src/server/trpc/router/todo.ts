import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const todoRouter = router({
    getAll: protectedProcedure
        .query(({ ctx }) => {
            return ctx.prisma.todo.findMany({
                where: {
                    userId: ctx.session?.user?.id
                }
            })
        }),
    add: protectedProcedure.input(z.object({
        content: z.string()
    }).required()).mutation(({ ctx, input }) => {
        const userId = ctx?.session?.user?.id ?? undefined

        if (!userId) return

        return ctx.prisma.todo.create({
            data: { ...input, userId, createdAt: new Date(), updatedAt: new Date() }
        })
    }),
    remove: protectedProcedure
        .input(z.object({
            todoId: z.string(),
        }).required()).mutation(async ({ ctx, input }) => {
            return await ctx.prisma.todo.delete({
                where: {
                    id: input.todoId
                }
            })
        }),
    toggle: protectedProcedure.input(z.object({
        todoId: z.string(),
        completed: z.boolean(),
    }).required()).mutation(async ({ ctx, input }) => {
        return await ctx.prisma.todo.update({
            where: {
                id: input.todoId,
            },
            data: {
                completed: !input.completed
            }
        })
    })
})
