import Image from "next/image";
import { useRouter } from "next/router";

type Props = {
    data?: Array<{
        id: number;
        title_english: string;
        title: string;
        image: string;
        review: number;
    }>;
}

const TITLE_MAX_LENGTH = 32;

export const AnimeList = (props: Props) => {
    const router = useRouter();

    if (!props.data) {
        return null;
    }

    const list = props.data.map(anime => {
        const title = anime.title === '' ? anime.title_english : anime.title;
        const animeTitle = title.length > TITLE_MAX_LENGTH ? `${title.slice(0, TITLE_MAX_LENGTH)}...` : title;
        const review = anime.review === 0 ? '-' : anime.review.toFixed(1);

        return (
            <div
                className="anime cursor-pointer md:h-56 md:w-72 relative"
                key={anime.id}
                onClick={() => router.push(`/anime/${anime.id}`)}
            >
                <h1 className="font-medium md:text-xl text-center mt-2">
                    {animeTitle}
                </h1>
                <div className="relative w-full h-32 mt-4">
                    <Image
                        src={anime.image}
                        alt={anime.title}
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
                <div className="text-red-500 font-bold absolute -top-6 -right-6 z-10 w-12 h-12 rounded-full grid place-items-center bg-white border-2 border-gray-700">
                    {review}
                </div>
            </div>
        )
    });

    return props.data.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 pb-24 px-3">
            {list}
        </div>
    ) : <h1 className="text-2xl">No results found...</h1>;
}