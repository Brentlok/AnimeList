import { Dispatch, SetStateAction } from "react";

type Props = {
    setDataUrl: Dispatch<SetStateAction<string>>;
}

export const File = (props: Props) => {
    const getFile = async (files: FileList | null) => {
        if (files === null) {
            return;
        }

        const item = files.item(0);

        if (item === null || item.type.split('/').find(() => true) !== 'image') {
            return;
        }

        props.setDataUrl(URL.createObjectURL(item));
    }

    return (
        <div>
            <label
                htmlFor="upload"
                className="w-24 h-24 border-red-500 border-2 cursor-pointer rounded-full grid place-items-center text-center"
            >
                Upload avatar
            </label>
            <input
                type="file"
                id="upload"
                className="hidden"
                onChange={e => getFile(e.target.files)} />
        </div>
    );
}