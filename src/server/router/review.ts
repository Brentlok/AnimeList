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
            const reviewsBase = await ctx.prisma.review.findMany({
                take: input.paging.count,
                skip: input.paging.count * input.paging.page,
            });

            const users = await ctx.prisma.user.findMany({
                where: { id: { in: reviewsBase.map(x => x.userId) } },
                select: {
                    id: true,
                    image: true,
                    name: true,
                }
            });

            const animeTitles = await ctx.prisma.anime.findMany({
                where: {
                    id: { in: reviewsBase.map(x => x.animeId) }
                },
                select: {
                    id: true,
                    title: true,
                }
            });

            const allRecordsCount = await ctx.prisma.review.count({});
            const maxPage = Math.ceil(allRecordsCount / input.paging.count);
            const reviews = reviewsBase
                .map(x => ({ ...x, user: users.find(user => user.id === x.userId) }))
                .map(x => ({
                    ...x,
                    animeTitle: animeTitles
                        .find(anime => anime.id === x.animeId)?.title ?? '',
                }));

            return {
                result: reviews,
                paging: {
                    ...input.paging,
                    maxPage,
                }
            }
        },
    });