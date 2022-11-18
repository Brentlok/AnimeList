import { useRouter } from "next/router";
import { GoBack, Loading } from "~/bits";
import { AnimeForm, FormDataType } from "~/components";
import { fromExternalImg, pocketBase, trpc } from "~/utils";

const Edit = () => {
    const router = useRouter();
    const id = Number(router.query.id as string);
    const { data: anime, isLoading } = trpc.useQuery(['anime.byId', { id }]);
    const edit = trpc.useMutation(['anime.edit']);

    if (isLoading || !anime) {
        return <Loading />;
    }

    const onSubmit = async (data: FormDataType) => {
        const image = await pocketBase.addFile(data.file);
        await edit.mutateAsync({
            id,
            title: data.title,
            title_english: data.title_english,
            description: data.description,
            image: image === '' ? anime.image : image,
        });
    }

    const animeData = {
        title: anime.title ?? '',
        title_english: anime.title_english ?? '',
        description: anime.description ?? '',
        image: fromExternalImg(anime.image),
    };

    const success = edit.isSuccess
        ? (
            <div className="anime fixed bg-white bottom-10">
                <h1 className="text-red-500">Edit request has been sent</h1>
            </div>
        )
        : null

    return (
        <>
            <h1 className="text-3xl font-semibold text-gray-700">Edit Anime</h1>
            <AnimeForm
                anime={animeData}
                onSubmit={onSubmit}
                isLoading={edit.isLoading}
            />

            {success}
            <GoBack />
        </>
    );
}

export default Edit;