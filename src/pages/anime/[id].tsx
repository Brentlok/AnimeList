import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { GoBack, If } from "~/bits";
import { Comments } from "~/components";
import { AddReview } from "~/components/AddReview";
import { trpc } from "~/utils";

const Anime = () => {
    const router = useRouter();
    const id = Number(router.query.id as string);

    const { data, isLoading, refetch } = trpc.useQuery(['anime.byId', { id }]);
    const { data: session } = useSession();

    const title = data?.title ?? data?.title_english;

    const review = (Boolean(data?.review) && data?.review !== 0) ? data?.review?.toFixed(1) : '-';

    return (
        <main className="main pt-24">
            <If condition={() => isLoading}>
                <Image
                    src='/ball-triangle.svg'
                    alt=""
                    width={256}
                    height={256}
                />
            </If>

            <If condition={() => !isLoading && Boolean(data)}>
                <h1 className="text-3xl font-semibold flex gap-4 items-center">
                    {title}
                    <div className="border-4 border-gray-700 rounded-full w-16 h-16 grid place-items-center">
                        <span className="text-red-500">{review}</span>
                    </div>
                </h1>
                <div className="flex flex-col gap-4 justify-center md:flex-row w-full mt-6 items-center">
                    <div className="relative w-96 h-96">
                        <Image
                            src={data?.image ?? ''}
                            alt={data?.title}
                            layout="fill"
                            objectFit="contain"
                        />
                    </div>
                    <span className="w-1/2 lg:max-w-xl tracking-wider">{data?.description}</span>
                </div>

                <If condition={() => Boolean(session?.user)}>
                    <AddReview
                        animeId={id}
                        userReview={data?.userReview}
                        refetch={refetch}
                    />
                </If>

                <Comments
                    comments={data?.reviews}
                />
            </If>

            <If condition={() => data === null}>
                <h1 className="text-3xl">Anime not found...</h1>
            </If>

            <GoBack />
        </main>
    );
};

export default Anime;