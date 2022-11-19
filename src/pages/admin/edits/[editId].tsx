import Image from "next/image";
import { useRouter } from "next/router";
import { Button, GoBack, If, Loading } from "~/bits";
import { fromExternalImg, trpc } from "~/utils";

type Props = {
    role: 'From' | 'To',
    image?: string;
    title?: string;
    title_english?: string;
    description?: string;
}

const Anime = (props: Props) => (
    <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl">{props.role}</h1>
        <div className="relative w-48 h-48">
            <Image
                src={fromExternalImg(props.image)}
                alt={props.title}
                layout="fill"
                objectFit="contain"
            />
        </div>
        <h1>Title: {props.title}</h1>
        <If condition={() => Boolean(props.title_english)}>
            <h1>Title English: {props.title_english}</h1>
        </If>
        <div>
            <h1>Description:</h1>
            <span>
                {props.description}
            </span>
        </div>
    </div>
)

const EditDetails = () => {
    const router = useRouter();
    const id = Number(router.query.editId as string);

    const { data, isLoading } = trpc.useQuery(['edit.byId', { id }]);

    if (isLoading || !data) {
        return <Loading />;
    }

    const { anime } = data;

    return (
        <>
            <h1 className="text-3xl">Details</h1>

            <div className="flex w-full max-w-4xl justify-around items-center">
                <Anime
                    role="From"
                    image={anime.image}
                    title={anime.title}
                    title_english={anime.title_english}
                    description={anime.description}
                />

                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 16 16">
                    <path className="fill-black" d="M7.3 14.875a.994.994 0 0 1-.288-.7.91.91 0 0 1 .263-.7l4.9-4.9H1a.968.968 0 0 1-.713-.288A.967.967 0 0 1 0 7.575a.97.97 0 0 1 .287-.713A.97.97 0 0 1 1 6.575h11.175l-4.9-4.9a.91.91 0 0 1-.263-.7.994.994 0 0 1 .288-.7A.948.948 0 0 1 8 0a.95.95 0 0 1 .7.275l6.6 6.6c.1.083.171.187.213.312.041.125.062.255.062.388s-.02.258-.062.375a.883.883 0 0 1-.213.325l-6.6 6.6a.948.948 0 0 1-.7.275.948.948 0 0 1-.7-.275Z" />
                </svg>

                <Anime
                    role="To"
                    image={data.image}
                    title={data.title}
                    title_english={data.title_english}
                    description={data.description}
                />
            </div>

            <div className="fixed bottom-10">
                <Button
                    buttonText="Accept Edit"
                />
            </div>

            <GoBack />
        </>
    );
}

export default EditDetails;