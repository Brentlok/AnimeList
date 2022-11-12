import Image from "next/image";
import { Button, Loading } from "~/bits";
import { fromExternalImg, trpc } from "~/utils";

const Anime = () => {
    const list = trpc.useQuery(['anime.waitingForApproval']);
    const accept = trpc.useMutation('anime.accept');

    const acceptAnime = async (id: number) => {
        await accept.mutateAsync(id);
        list.refetch();
    }

    if (list.isFetching) {
        return <Loading />;
    }

    const items = list.data?.map(item => (
        <div key={item.id} className="flex items-center gap-4 w-full">
            <div className="relative w-1/2 h-32">
                <Image
                    src={fromExternalImg(item.image)}
                    alt=''
                    layout="fill"
                    objectFit="contain"
                />
            </div>
            <div className="w-1/2 text-center">
                <h1 className="text-xl">{item.title ?? item.title_english}</h1>
                <div className="tracking-wider my-4">{item.description}</div>
                <div className="w-full grid place-items-center">
                    <Button
                        buttonText="Accept"
                        buttonAction={() => acceptAnime(item.id)}
                    />
                </div>
            </div>
        </div>
    ))

    return (
        <>
            <h1 className="text-2xl">List of Anime waiting for Admin&apos;s approval</h1>
            {items}
        </>
    )
}

export default Anime;