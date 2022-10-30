import { z } from "zod";
import { createProtectedRouter } from "./protected-router";

export const profileRouter = createProtectedRouter()
    .mutation("changeName", {
        input: z.
            object({
                name: z.string(),
            }),
        async resolve({ ctx, input }) {
            await ctx.prisma.user.update({
                data: {
                    name: input.name,
                },
                where: {
                    id: ctx.session.user.id,
                }
            })
        }
    });