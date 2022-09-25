import Image from "next/image";
import { useEffect, useState } from "react";
import ReactPaginate from 'react-paginate';
import { If, Input } from "~/bits";
import { AnimeList } from "~/components";
import { hooks, trpc } from "~/utils";

const Search = () => {
    const [page, setPage] = useState(0);

    const [anime, debouncedAnime, setAnime] = hooks.useParam(
        'anime',
        'search',
        '/',
    );

    const { data, isLoading } = trpc.useQuery([
        "anime.byName",
        { 
            anime: debouncedAnime,
            paging: {
                count: 12,
                page,
            },
        },
    ]);

    useEffect(() => {
        setPage(0);
    }, [debouncedAnime]);

    return (
        <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4 gap-6">
            <Input 
                value={anime}
                onChange={setAnime}
                placeholder="Write Anime Name..."
            />
                <div className="fetching grid place-items-center gap-4">
                    <If condition={() => !isLoading}>
                        <AnimeList
                            data={data?.result}
                        />
                        <ReactPaginate
                            className="flex fixed bottom-5 anime gap-3 bg-white z-10"
                            activeClassName="text-red-500 font-bold"
                            previousLabel=''
                            nextLabel=''
                            renderOnZeroPageCount={() => null}
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
        </main>
    )
};

export default Search;
