import { createProtectedRouter } from "./protected-router";

export const editRouter = createProtectedRouter()
    .query("list", {
        async resolve({ ctx }) {
            const editsBase = await ctx.prisma.edit.findMany({
                select: {
                    id: true,
                    userId: true,
                    animeId: true,
                },
            });

            const users = await ctx.prisma.user.findMany({
                where: { id: { in: editsBase.map(x => x.userId) } },
                select: {
                    id: true,
                    image: true,
                    name: true,
                }
            });

            const animeTitles = await ctx.prisma.anime.findMany({
                where: {
                    id: { in: editsBase.map(x => x.animeId) }
                },
                select: {
                    id: true,
                    title: true,
                }
            });

            const reviews = editsBase
                .map(x => ({ ...x, user: users.find(user => user.id === x.userId) }))
                .map(x => ({
                    ...x,
                    animeTitle: animeTitles
                        .find(anime => anime.id === x.animeId)?.title ?? '',
                }));

            return {
                result: reviews,
            }
        },
    })