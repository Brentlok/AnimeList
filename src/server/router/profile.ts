import { z } from "zod";
import { createProtectedRouter } from "./protected-router";
import PocketBase from 'pocketbase';
import { base64ToForm } from "../api_utils";

const client = new PocketBase('http://54.37.138.225:5555');

export const profileRouter = createProtectedRouter()
    .mutation("updateProfile", {
        input: z.
            object({
                name: z.string(),
                avatarData: z.string(),
            }),
        async resolve({ ctx, input }) {
            const path = '';
            if (input.avatarData !== '') {
                const oldImage = ctx.session.user.image ?? '';

                // Test if oldImage comes from file server
                // if (!/https:\/\//.test(oldImage)) {
                //     const oldFileId = oldImage.split('/').find(() => true) ?? '';
                //     await client.records.delete('files', oldFileId);
                // }

                const form = await base64ToForm(input.avatarData);
                // const created = await client.records.create('files', form);
                // path = `${created.id}/${created.file}`;
            }

            await ctx.prisma.user.update({
                data: {
                    name: input.name,
                    ...path !== '' ? { image: path } : {},
                },
                where: {
                    id: ctx.session.user.id,
                }
            })
        }
    });