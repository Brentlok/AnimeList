import { useEffect, useRef } from "react";
import ReactPaginate from 'react-paginate';
import { Input, Loading } from "~/bits";
import { AnimeList } from "~/components";
import { hook, trpc } from "~/utils";

const Search = () => {
    const isMounted = useRef(false);
    const [anime, debouncedAnime, setAnime] = hook.useParam(
        'anime',
        '',
        (p) => String(p),
        '/',
    );
    const [page, debouncedPage, setPage] = hook.useParam(
        'page',
        1,
        (p) => Number(p),
    );

    const { data, isLoading } = trpc.useQuery([
        "anime.byName",
        {
            anime: debouncedAnime,
            paging: {
                count: 12,
                page: debouncedPage - 1,
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

        setPage(1);
    }, [debouncedAnime, setPage]);

    const maxPage = data?.paging.maxPage ?? 0;

    const forcePage = () => {
        if (!isMounted.current) {
            return undefined;
        }

        const forcePageValue = page - 1;
        return forcePageValue <= maxPage ? forcePageValue : maxPage;
    }

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            <Input.Text
                focusOnStart={true}
                value={anime}
                onChange={setAnime}
                placeholder="Write Anime Name..."
            />
            <div className="fetching grid place-items-center gap-4 mt-4">
                <AnimeList
                    data={data?.result}
                />
                <ReactPaginate
                    className="flex fixed bottom-5 anime gap-3 bg-white z-10"
                    activeClassName="text-red-500 font-bold"
                    previousLabel=''
                    nextLabel=''
                    forcePage={forcePage()}
                    renderOnZeroPageCount={() => null}
                    onPageChange={e => setPage(e.selected + 1)}
                    pageCount={maxPage}
                />
            </div>
        </>
    );
};

export default Search;
