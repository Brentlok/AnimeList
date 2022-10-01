import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Input } from "~/bits";
import { hooks } from "~/utils";

const Home = () => {
    const router = useRouter();
    const [anime, setAnime] = useState('');
    const debouncedAnime = hooks.useDebounce(anime, 300);

    useEffect(() => {
        if (debouncedAnime === '') {
            return;
        }

        router.push({
            pathname: '/search',
            query: { anime: debouncedAnime },
        })
    }, [debouncedAnime, router]);

    return (
        <main className="main p-4">
            <h1 className="text-2xl text-gray-700 text-center">
                AnimeList is an app which allows you to rank your favorite anime!
            </h1>
            <Input
                value={anime}
                onChange={setAnime}
                placeholder="Write Anime Name..."
            />
        </main>
    )
};

export default Home;
