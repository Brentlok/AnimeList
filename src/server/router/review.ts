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
    .mutation("remove", {
        input: z.
            object({
                reviewId: z.number(),
            }),
        async resolve({ ctx, input }) {
            await ctx.prisma.review.delete({
                where: {
                    id: input.reviewId,
                },
            });
        }
    })
    .query("list", {
        input: z.object({
            paging: z.object({
                count: z.number(),
                page: z.number(),
            }),
        }),
        async resolve({ ctx, input }) {
            const reviews = await ctx.prisma.review.findMany({
                take: input.paging.count,
                skip: input.paging.count * input.paging.page,
                select: {
                    id: true,
                    review: true,
                    comment: true,
                    user: {
                        select: {
                            image: true,
                            name: true,
                        }
                    },
                    anime: {
                        select: {
                            title: true,
                        }
                    }
                }
            });

            const allRecordsCount = await ctx.prisma.review.count({});
            const maxPage = Math.ceil(allRecordsCount / input.paging.count);

            return {
                result: reviews,
                paging: {
                    ...input.paging,
                    maxPage,
                }
            }
        },
    });