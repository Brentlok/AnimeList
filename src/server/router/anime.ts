import { z } from "zod";
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
                orderBy: {
                    title_english: 'asc',
                }
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

                return { id: anime.id, review: review._avg.review }
            }));

            const listWithReviews = list.map(anime => ({ ...anime, review: reviews[anime.id]?.review ?? 0 }));

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

            const review = await ctx.prisma.review.aggregate({
                _avg: {
                    review: true,
                },
                where: {
                    animeId: {
                        equals: input.id,
                    },
                },
            });

            return { ...anime, review: review._avg.review };
        }
    });
