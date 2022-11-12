import { AnimeForm, FormDataType } from "~/components"
import { pocketBase, trpc } from "~/utils";

const Add = () => {
    const addAnime = trpc.useMutation('anime.add');

    const onSubmit = async (data: FormDataType) => {
        const image = await pocketBase.addFile(data.file);
        await addAnime.mutateAsync({
            title: data.title,
            title_english: data.title_english,
            description: data.description,
            image,
        });
    }

    return (
        <>
            <h1 className="text-3xl font-semibold text-gray-700">Add new Anime</h1>
            <AnimeForm onSubmit={onSubmit} isLoading={addAnime.isLoading} />
        </>
    );
}

export default Add;