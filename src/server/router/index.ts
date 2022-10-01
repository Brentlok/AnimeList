import { createRouter } from "./context";
import superjson from "superjson";
import { animeRouter } from "./anime";

export const appRouter = createRouter()
    .transformer(superjson)
    .merge("anime.", animeRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
