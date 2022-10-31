import Image from "next/image";
import { useEffect, useRef } from "react";
import ReactPaginate from 'react-paginate';
import { If, Input } from "~/bits";
import { AnimeList } from "~/components";
import { hook, trpc } from "~/utils";

const Search = () => {
    const isMounted = useRef(false);
    const [anime, debouncedAnime, setAnime] = hook.useParam('anime', '/');
    const [page, debouncedPage, setPage] = hook.useParam('page');

    const { data, isLoading } = trpc.useQuery([
        "anime.byName",
        {
            anime: debouncedAnime,
            paging: {
                count: 12,
                page: Number(debouncedPage),
            },
        },
    ]);

    useEffect(() => {
        if (debouncedAnime === '') {
            return;
        }

        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }

        setPage('1');
    }, [debouncedAnime, setPage]);

    const maxPage = data?.paging.maxPage ?? 0;

    const forcePageValue = Number(page) - 1;
    const forcePage = forcePageValue <= maxPage ? forcePageValue : maxPage - 1;

    return (
        <>
            <Input.Text
                focusOnStart={true}
                value={anime}
                onChange={setAnime}
                placeholder="Write Anime Name..."
            />
            <div className="fetching grid place-items-center gap-4 mt-4">
                <If condition={() => !isLoading}>
                    <AnimeList
                        data={data?.result}
                    />
                    <ReactPaginate
                        className="flex fixed bottom-5 anime gap-3 bg-white z-10"
                        activeClassName="text-red-500 font-bold"
                        previousLabel=''
                        nextLabel=''
                        forcePage={forcePage}
                        renderOnZeroPageCount={() => null}
                        onPageChange={e => setPage(String(e.selected + 1))}
                        pageCount={maxPage}
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
        </>
    )
};

export default Search;
