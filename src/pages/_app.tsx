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
            <Nav/>
            <Component {...pageProps} />
        </SessionProvider>
      </>
  );
};

const getBaseUrl = () => {
  if (process.env.VERCEL_URL) return `${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
  config() {
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      url,
      transformer: superjson,
    };
  },
  ssr: true,
})(MyApp);
