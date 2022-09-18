import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ReactPaginate from 'react-paginate';
import { If, Input } from "~/bits";
import { AnimeList } from "~/components";
import { hooks, trpc } from "~/utils";

const Home = () => {
    const router = useRouter();
    const [anime, setAnime] = useState('');
    const [page, setPage] = useState(1);
    const [searching, setSearching] = useState(false);
    const debouncedAnime = hooks.useDebounce(anime, 300);
    const { data, isLoading } = trpc.useQuery([
        "anime.byName",
        { 
            anime: debouncedAnime,
            paging: {
                count: 9,
                page,
            },
        },
    ]);
    
    useEffect(() => {
        if(data?.result.length && data.result.length > 0) {
            setSearching(true);
        }
    }, [data?.result]);

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
            setSearching(false);
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
            <If condition={() => !searching}>
                <h1 className="text-2xl text-gray-700">
                    AnimeList is an app which allows you to rank your favorite anime!
                </h1>
            </If>
            <Input 
                value={anime}
                onChange={setAnime}
                placeholder="Write Anime Name..."
            />
            <If condition={() => searching}>
                <div className="fetching grid place-items-center gap-4">
                    <If condition={() => !isLoading}>
                        <AnimeList
                            data={data?.result ?? []}
                        />
                        <ReactPaginate
                            className="flex anime gap-3 w-min"
                            activeClassName="text-red-500 font-bold"
                            previousLabel=''
                            nextLabel=''
                            forcePage={page}
                            onPageChange={e => setPage(e.selected)}
                            pageCount={data?.paging.maxPage ?? 0}
                        />
                    </If>
                    <If condition={() => isLoading}>
                        <Image 
                            src='/ball-triangle.svg'
                            alt=""
                            width={256}
                            height={256}
                        />
                    </If>
                </div>
            </If>
        </main>
    )
};

export default Home;
