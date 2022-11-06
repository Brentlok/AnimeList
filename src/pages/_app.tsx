// src/pages/_app.tsx
import { withTRPC } from "@trpc/next";
import type { AppRouter } from "../server/router";
import type { AppType } from "next/dist/shared/lib/utils";
import superjson from "superjson";
import { SessionProvider } from "next-auth/react";
import "~/styles/globals.css";
import { Nav } from "~/components";
import Head from "next/head";
import { useAtom } from "jotai";
import { profileAtom } from "~/state";
import { Loading } from "~/bits";

const MyApp: AppType = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    const [profile] = useAtom(profileAtom);

    const content = profile.initialized
        ? <Component {...pageProps} />
        : <Loading />;

    return (
        <>
            <Head>
                <title>AnimeList</title>
                <meta name="description" content="AnimeList" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <SessionProvider session={session}>
                <Nav />
                <main className="main py-24 px-4">
                    {content}
                </main>
            </SessionProvider>
        </>
    );
};

export default withTRPC<AppRouter>({
    config() {
        const url = `${process.env.NEXT_PUBLIC_URL}/api/trpc`;

        return {
            url,
            transformer: superjson,
        };
    },
    ssr: true,
})(MyApp);
