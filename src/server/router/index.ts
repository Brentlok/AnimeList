import { createRouter } from "./context";
import superjson from "superjson";
import { animeRouter } from "./anime";
import { reviewRouter } from "./review";
import { profileRouter } from "./profile";

export const appRouter = createRouter()
    .transformer(superjson)
    .merge("anime.", animeRouter)
    .merge("review.", reviewRouter)
    .merge('profile.', profileRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
