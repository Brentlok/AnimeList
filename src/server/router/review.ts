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
    })
    .mutation("modify", {
        input: z.
            object({
                reviewId: z.number(),
                review: z.number(),
                comment: z.string(),
            }),
        async resolve({ ctx, input }) {
            await ctx.prisma.review.update({
                where: {
                    id: input.reviewId,
                },
                data: {
                    review: input.review,
                    comment: input.comment,
                }
            });
        }
    })
    .query("list", {
        async resolve({ ctx }) {
            const reviews = await ctx.prisma.review.findMany({
                take: 12,
            });

            const users = await ctx.prisma.user.findMany({
                where: { id: { in: reviews.map(x => x.userId) } },
                select: {
                    id: true,
                    image: true,
                    name: true,
                }
            });

            return reviews.map(x => ({ ...x, user: users.find(user => user.id === x.userId) }));
        },
    });