import { router, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";

export const todoRouter = router({
    global: publicProcedure
        .input(z.object({
            page: z.number().optional(),
            take: z.number().optional(),
        }))
        .query(async ({ ctx, input }) => {
            const skip = (input.take || 10) * ((input.page || 1) - 1)
            const count = await ctx.prisma.todo.count()
            const res = await ctx.prisma.todo.findMany({
                skip: skip,
                take: input.take || 10,
                include: {
                    user: true,
                },
            })
            return {
                data: res,
                lastPage: Math.ceil(count / (skip * (input.take || 10)))
            }
        }),
    getAll: protectedProcedure
        .query(({ ctx }) => {
            return ctx.prisma.todo.findMany({
                where: {
                    userId: ctx.session?.user?.id
                },
                include: {
                    user: true
                }
            })
        }),
    add: protectedProcedure.input(z.object({
        content: z.string()
    }).required()).mutation(({ ctx, input }) => {
        const userId = ctx?.session?.user?.id ?? undefined

        if (!userId) return

        return ctx.prisma.todo.create({
            data: { ...input, userId, createdAt: new Date(), updatedAt: new Date(), doneUser: "" }
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
                completed: !input.completed,
                doneUser: ctx.session.user.name || "",
                doneAt: new Date()
            }
        })
    })
})
