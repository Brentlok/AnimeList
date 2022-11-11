import { z } from "zod";
import { createProtectedRouter } from "./protected-router";

export const profileRouter = createProtectedRouter()
    .mutation("updateProfile", {
        input: z.
            object({
                name: z.string(),
                avatar: z.string(),
            }),
        async resolve({ ctx, input }) {
            await ctx.prisma.user.update({
                data: {
                    name: input.name,
                    ...input.avatar !== '' ? { image: input.avatar } : {},
                },
                where: {
                    id: ctx.session.user.id,
                }
            })
        }
    });