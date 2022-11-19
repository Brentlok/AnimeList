import { z } from "zod";
import { pocketBase } from "~/utils";
import { createProtectedRouter } from "./protected-router";

export const editRouter = createProtectedRouter()
    .query("list", {
        async resolve({ ctx }) {
            const edits = await ctx.prisma.edit.findMany({
                select: {
                    id: true,
                    userId: true,
                    animeId: true,
                    user: {
                        select: {
                            image: true,
                            name: true,
                        },
                    },
                    anime: {
                        select: {
                            title: true,
                        },
                    }
                },
            });

            return {
                result: edits,
            }
        },
    })
    .query("byId", {
        input: z.object({
            id: z.number(),
        }),
        async resolve({ input, ctx }) {
            return await ctx.prisma.edit.findFirst({
                where: { id: { equals: input.id } },
                select: {
                    title: true,
                    title_english: true,
                    description: true,
                    image: true,
                    anime: true,
                    user: true,
                }
            })
        }
    })
    .mutation("accept", {
        input: z.object({
            id: z.number(),
        }),
        async resolve({ input, ctx }) {
            const edit = await ctx.prisma.edit.findFirst({
                where: { id: { equals: input.id } },
                select: {
                    title: true,
                    title_english: true,
                    description: true,
                    image: true,
                    animeId: true,
                    anime: {
                        select: {
                            image: true,
                        },
                    },
                }
            });

            await ctx.prisma.anime.update({
                where: { id: edit?.animeId ?? 0 },
                data: {
                    image: edit?.image,
                    title: edit?.title,
                    title_english: edit?.title_english,
                    description: edit?.description,
                },
            });

            await ctx.prisma.edit.delete({ where: { id: input.id } });
            await pocketBase.removeFile(edit?.anime.image);

            return edit?.animeId;
        }
    })