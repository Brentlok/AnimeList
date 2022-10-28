import { z } from "zod";
import { toUndef } from "../api_utils";
import { createRouter } from "./context";

export const animeRouter = createRouter()
    .query("byName", {
        input: z
            .object({
                anime: z.string(),
                paging: z.object({
                    count: z.number(),
                    page: z.number(),
                }).nullish(),
            }),
        async resolve({ input, ctx }) {
            if (input.anime === '') {
                return {
                    result: [],
                    paging: {
                        ...input.paging,
                        maxPage: 0,
                    }
                };
            }

            const recordsToSkip = input.paging ? input.paging.count * input.paging.page : 0;
            const count = input.paging?.count ?? 12;

            const list = await ctx.prisma.anime.findMany({
                where: {
                    OR: [
                        {
                            title: {
                                contains: input.anime,
                            },
                        },
                        {
                            title_english: {
                                contains: input.anime,
                            },
                        },
                    ],
                },
                skip: recordsToSkip,
                take: count,
                select: {
                    id: true,
                    title: true,
                    title_english: true,
                    image: true,
                },
                orderBy: [
                    { Review: { _count: 'desc' } },
                    { title_english: 'asc' },
                ],
            });

            const reviews = await Promise.all(list.map(async anime => {
                const review = await ctx.prisma.review.aggregate({
                    _avg: {
                        review: true,
                    },
                    where: {
                        animeId: {
                            equals: anime.id,
                        },
                    },
                });

                return { animeId: anime.id, review: review._avg.review }
            }));

            const listWithReviews = list.map(anime => ({
                ...anime,
                review: reviews.find(review => review.animeId === anime.id)?.review ?? 0
            }));

            const allRecordsCount = await ctx.prisma.anime.count({
                where: {
                    OR: [
                        {
                            title: {
                                contains: input.anime,
                            },
                        },
                        {
                            title_english: {
                                contains: input.anime,
                            },
                        },
                    ],
                },
            });

            const maxPage = Math.ceil(allRecordsCount / count);

            return {
                result: listWithReviews,
                paging: {
                    ...input.paging,
                    maxPage,
                }
            };
        },
    })
    .query("byId", {
        input: z.object({
            id: z.number(),
        }),
        async resolve({ ctx, input }) {
            const anime = await ctx.prisma.anime.findFirst({ where: { id: { equals: input.id } } });

            const userReview = await ctx.prisma.review.findFirst({
                where: {
                    AND: {
                        userId: { equals: ctx.session?.user?.id },
                        animeId: { equals: input.id },
                    }
                },
                select: {
                    id: true,
                    review: true,
                    comment: true,
                },
            });

            const reviews = await ctx.prisma.review.findMany({
                where: { animeId: { equals: input.id, }, },
            });

            const users = await ctx.prisma.user.findMany({
                where: { id: { in: reviews.map(x => x.userId) } },
                select: {
                    id: true,
                    image: true,
                    name: true,
                }
            });

            const withUsers = reviews.map(x => ({ ...x, user: users.find(user => user.id === x.userId) }));

            const review = await ctx.prisma.review.aggregate({
                where: { animeId: { equals: input.id, }, },
                _avg: { review: true, },
            });

            return {
                ...anime,
                review: review._avg.review,
                userReview: toUndef(userReview),
                reviews: withUsers.filter(x => x.userId !== ctx.session?.user?.id),
            };
        }
    });
