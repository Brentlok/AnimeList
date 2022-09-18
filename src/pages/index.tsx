import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { If, Input } from "~/bits";
import { AnimeList } from "~/components";
import { hooks, trpc } from "~/utils";

const Home = () => {
    const router = useRouter();
    const [anime, setAnime] = useState('');
    const debouncedAnime = hooks.useDebounce(anime, 300);
    const animeList = trpc.useQuery(["anime.byName", { anime: debouncedAnime }]);
    

    useEffect(() => {
        const param = router.query.anime;

        if(param === '') {
            router.push('');
        }

        if(typeof param === 'string') {
            setAnime(param);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if(debouncedAnime === '') {
            router.push('');
        }

        if(router.query.anime === anime) {
            return;
        }

        router.push({
                pathname: '/',
                query: { anime: debouncedAnime },
            });


    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedAnime]);

    return (
        <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4 gap-6">
            <If condition={() => !animeList.data?.result?.length}>
                <h1 className="text-2xl text-gray-700">
                    AnimeList is an app which allows you to rank your favorite anime!
                </h1>
            </If>
            <Input 
                value={anime}
                onChange={setAnime}
                placeholder="Write Anime Name..."
            />
            <If condition={() => animeList.isFetched}>
                <AnimeList
                    data={animeList.data?.result ?? []}
                />
            </If>
        </main>
    )
};

export default Home;
