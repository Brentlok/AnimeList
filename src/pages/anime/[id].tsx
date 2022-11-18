import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Edit, GoBack, If, Loading } from "~/bits";
import { AddReview, Comments } from "~/components";
import { fromExternalImg, trpc } from "~/utils";

const Anime = () => {
    const router = useRouter();
    const id = Number(router.query.id as string);

    const { data: session } = useSession();
    const { data, isLoading, refetch } = trpc.useQuery(['anime.byId', { id, userId: session?.user?.id }]);

    if (isLoading) {
        return <Loading />;
    }

    const title = data?.title ?? data?.title_english;
    const review = (Boolean(data?.review) && data?.review !== 0) ? data?.review?.toFixed(1) : '-';

    const addReview = session?.user
        ? (
            <AddReview
                animeId={id}
                userReview={data?.userReview}
                refetch={refetch}
            />
        ) : (
            <div
                className="anime cursor-pointer"
                onClick={() => signIn()}
            >
                Login to add your review
            </div>
        );

    return (
        <>
            <If condition={() => !isLoading && Boolean(data)}>
                <h1 className="text-2xl sm:text-3xl font-semibold flex gap-4 items-center">
                    {title}
                    <div className="border-4 border-gray-700 rounded-full w-16 h-16 grid place-items-center">
                        <span className="text-red-500">{review}</span>
                    </div>
                </h1>

                <div className="flex flex-col gap-4 justify-center md:flex-row w-full mt-6 items-center">
                    <div className="relative w-96 h-96">
                        <Image
                            src={fromExternalImg(data?.image)}
                            alt={data?.title}
                            layout="fill"
                            objectFit="contain"
                        />
                    </div>
                    <span className="w-full md:w-1/2 lg:max-w-xl tracking-wider p-5">{data?.description}</span>
                </div>
                <Edit onClick={() => router.push(`/edit/${id}`)} />

                {addReview}

                <Comments
                    comments={data?.reviews}
                />
            </If>

            <If condition={() => data === null}>
                <h1 className="text-3xl">Anime not found...</h1>
            </If>

            <GoBack />
        </>
    );
};

export default Anime;