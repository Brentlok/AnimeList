// src/pages/_app.tsx
import { withTRPC } from "@trpc/next";
import type { AppRouter } from "../server/router";
import type { AppType } from "next/dist/shared/lib/utils";
import superjson from "superjson";
import { SessionProvider } from "next-auth/react";
import "~/styles/globals.css";
import { Nav } from "~/components";
import Head from "next/head";

const MyApp: AppType = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
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
                    <Component {...pageProps} />
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
