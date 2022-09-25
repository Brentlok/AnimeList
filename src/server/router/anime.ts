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
                orderBy: {
                    title_english: 'asc',
                }
            });

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
                result: list,
                paging: {
                    ...input.paging,
                    maxPage,
                }
            };
        },
    });
