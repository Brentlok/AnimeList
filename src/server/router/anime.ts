import { z } from "zod";
import { createRouter } from "./context";
import { createProtectedRouter } from "./protected-router";

const protectedRouter = createProtectedRouter()
    .mutation('add', {
        input: z.object({
            title: z.string(),
            title_english: z.string(),
            description: z.string(),
            image: z.string(),
        }),
        async resolve({ ctx, input }) {
            const res = await ctx.prisma.anime.create({
                data: {
                    title: input.title,
                    title_english: input.title_english,
                    description: input.description,
                    image: input.image,
                    waitingForApproval: !ctx.session.user.isAdmin,
                }
            });

            return res.id;
        },
    })
    .mutation('edit', {
        input: z.object({
            id: z.number(),
            title: z.string(),
            title_english: z.string(),
            description: z.string(),
            image: z.string().nullish(),
        }),
        async resolve({ ctx, input }) {
            await ctx.prisma.edit.create({
                data: {
                    title: input.title,
                    title_english: input.title_english,
                    description: input.description,
                    image: input.image ?? '',
                    animeId: input.id,
                    userId: ctx.session.user.id,
                }
            });
        },
    })
    .query('waitingForApproval', {
        async resolve({ ctx }) {
            if (!ctx.session.user.isAdmin) {
                return [];
            }

            return await ctx.prisma.anime.findMany({
                where: {
                    waitingForApproval: {
                        equals: true,
                    }
                }
            })
        }
    })
    .mutation('accept', {
        input: z.number(),
        async resolve({ ctx, input }) {
            if (!ctx.session.user.isAdmin) {
                return;
            }

            await ctx.prisma.anime.update({
                data: {
                    waitingForApproval: false,
                },
                where: {
                    id: input,
                }
            })
        }
    })

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
                    AND: {
                        waitingForApproval: {
                            not: true,
                        },
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
                    }
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

            const maxPage = Math.ceil(allRecordsCount / count) - 1;

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
            userId: z.string().nullish(),
        }),
        async resolve({ ctx, input }) {
            const anime = await ctx.prisma.anime.findFirst({
                where: { id: { equals: input.id } },
                select: {
                    id: true,
                    image: true,
                    title: true,
                    title_english: true,
                    description: true,
                    Review: {
                        select: {
                            id: true,
                            userId: true,
                            review: true,
                            comment: true,
                        },
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    image: true,
                                    name: true,
                                }
                            }
                        }
                    },
                }
            });

            const review = await ctx.prisma.review.aggregate({
                where: { animeId: { equals: input.id, }, },
                _avg: { review: true, },
            });

            if (anime?.Review) {
                anime.Review = anime.Review.filter(x => x.userId !== input.userId);
            }

            return {
                ...anime,
                review: review._avg.review,
                userReview: anime?.Review.find(x => x.userId === input.userId),
            };
        }
    }).merge(protectedRouter);
