import { Anime } from "@prisma/client"
import Image from "next/image";

type Props = {
    data?: Anime[];
}

export const AnimeList = (props: Props) => {
    if(!props.data) {
        return null;
    }

    const list = props.data.map(anime => {
        const TITLE_MAX_LENGTH = 32;
        const title = anime.title === '' ? anime.title_english : anime.title;
        const animeTitle = title.length > TITLE_MAX_LENGTH ? `${title.slice(0, TITLE_MAX_LENGTH)}...` : title;
        
        return (
            <div
                className="anime cursor-pointer md:h-52 md:w-72 overflow-hidden"
                key={anime.id}
            >
                <h1 className="font-medium text-xl text-center">
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
            </div>
        )
    });

    return props.data.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 pb-24">
            {list}
        </div>
    ) : <h1 className="text-2xl">No results found...</h1>;
}