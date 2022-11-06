import { useAtom } from "jotai";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import { GoBack, Loading } from "~/bits";
import { Comments } from "~/components";
import { profileAtom } from "~/state";
import { confirmPrompt, trpc } from "~/utils";

const Reviews = () => {
    const [page, setPage] = useState(0);

    const { data, status, refetch } = trpc.useQuery(
        ['review.list', { paging: { page, count: 12 } }],
    );

    const remove = trpc.useMutation('review.remove');

    const handleRemove = async (reviewId: number) => {
        const res = confirmPrompt(() => null);
        if (!res) {
            return;
        }

        await remove.mutateAsync({ reviewId });
        refetch();
    }

    if (status === 'loading') {
        return <Loading />;
    }

    return (
        <>
            <h1 className="text-3xl">Reviews</h1>

            <Comments
                comments={data?.result}
                isAdmin={true}
                remove={handleRemove}
            />

            <ReactPaginate
                className="flex fixed bottom-5 anime gap-3 bg-white z-10"
                activeClassName="text-red-500 font-bold"
                previousLabel=''
                nextLabel=''
                forcePage={page}
                renderOnZeroPageCount={() => null}
                onPageChange={e => setPage(e.selected)}
                pageCount={data?.paging.maxPage ?? 0}
            />

            <GoBack />
        </>
    );
}

export default function R() {
    const [profile] = useAtom(profileAtom);

    return profile.initialized ? <Reviews /> : <Loading />;
}