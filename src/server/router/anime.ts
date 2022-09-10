import { z } from "zod";
import { wait } from "~/utils";
import { createProtectedRouter } from "./protected-router";

export const animeRouter = createProtectedRouter()
  .query("hello", {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    },
  })
  .mutation('fetchList', {
      async resolve({ ctx }) {
          await ctx.prisma.anime.deleteMany({});
          await fetchList();
      }
  })
;

const fetchList = async (page = 1) => {
    console.log(`Fetching page no${page}...`);
    const data = await fetch(`https://api.jikan.moe/v4/anime?page=${page}`);
    const res = await data.json();

    const parsed = await z.object({
        pagination: z.object({
            'has_next_page': z.boolean(),
        }),
        data: z.array(
            z.object({
                mal_id: z.number(),
                title: z.string().nullish(),
                'title_english': z.string().nullish(),
                images: z.object({
                    jpg: z.object({
                        'image_url': z.string().nullish(),
                    }),
                }),
                synopsis: z.string().nullish(),
            }),
        ),
    }).parseAsync(res);

    parsed.data.forEach(async anime => {
        await prisma?.anime.create({
            data: {
                id: anime.mal_id,
                title: anime.title ?? '',
                title_english: anime.title_english ?? anime.title ?? '',
                description: anime.synopsis ?? '',
                image: anime.images.jpg.image_url ?? '',
            }
        });
    });

    if(!parsed.pagination.has_next_page) {
        console.log('--- END ---');
        return;
    }

    await wait(1000);

    fetchList(page + 1);
}
