import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Input } from "~/bits";
import { hook } from "~/utils";

const Home = () => {
    const router = useRouter();
    const [anime, setAnime] = useState('');
    const debouncedAnime = hook.useDebounce(anime, 300);

    useEffect(() => {
        if (debouncedAnime === '') {
            return;
        }

        router.push({
            pathname: '/search',
            query: {
                anime: debouncedAnime,
                page: '1',
            },
        })
    }, [debouncedAnime, router]);

    return (
        <>
            <h1 className="text-2xl text-gray-700 text-center">
                AnimeList is an app which allows you to rank your favorite anime!
            </h1>
            <Input.Text
                value={anime}
                onChange={setAnime}
                placeholder="Write Anime Name..."
            />
        </>
    )
};

export default Home;
