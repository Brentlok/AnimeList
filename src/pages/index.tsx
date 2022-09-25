import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Input } from "~/bits";
import { hooks } from "~/utils";

const Home = () => {
    const router = useRouter();
    const [anime, setAnime] = useState('');
    const debouncedAnime = hooks.useDebounce(anime, 300);

    useEffect(() => {
        if(debouncedAnime === '') {
            return;
        }

        router.push({
            pathname: '/search',
            query: { anime: debouncedAnime },
        })
    }, [debouncedAnime, router]);

    return (
        <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4 gap-6">
                <h1 className="text-2xl text-gray-700">
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
