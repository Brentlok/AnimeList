import { z } from "zod";
import { createProtectedRouter } from "./protected-router";

export const reviewRouter = createProtectedRouter()
    .mutation("create", {
        input: z.
            object({
                review: z.number(),
                animeId: z.number(),
                comment: z.string(),
            }),
        async resolve({ ctx, input }) {
            await ctx.prisma.review.create({
                data: {
                    animeId: input.animeId,
                    userId: ctx.session.user.id,
                    review: input.review,
                    comment: input.comment,
                }
            });
        }
    });