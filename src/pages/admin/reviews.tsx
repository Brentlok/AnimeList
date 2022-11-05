import { useAtom } from "jotai";
import Image from "next/image";
import { useEffect } from "react";
import { GoBack } from "~/bits";
import { Comments } from "~/components";
import { profileAtom } from "~/state";
import { trpc } from "~/utils";

const Reviews = () => {
    const { data, status, refetch } = trpc.useQuery(['review.list'], { enabled: false });
    const [profile] = useAtom(profileAtom);

    useEffect(() => {
        if (profile.initialized) {
            refetch();
        }
    }, [profile.initialized, refetch]);

    if (!profile.initialized || status === 'loading') {
        return (
            <Image
                src='/ball-triangle.svg'
                alt=""
                width={256}
                height={256}
            />
        );
    }

    return (
        <>
            <h1 className="text-3xl">Reviews</h1>
            <GoBack />
            <Comments comments={data} />
        </>
    );
}

export default Reviews;