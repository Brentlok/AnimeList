import Image from "next/image"
import { If, Input } from "~/bits";
import { cropString, fromExternalImg } from "~/utils";

type Props = {
    comments?: CommentProps[];
    isAdmin?: boolean;
    remove?: (removeId: number) => void;
}

type CommentProps = {
    id: number;
    user?: {
        image: string | null;
        name: string | null;
    },
    review: number;
    comment: string | null;
    animeTitle?: string;
    isAdmin?: boolean;
    remove?: (removeId: number) => void;
}

const Comment = (props: CommentProps) => (
    <div className="w-full anime flex relative">
        <If condition={() => Boolean(props.isAdmin)}>
            <div
                className="absolute bg-red-500 top-2 right-2"
                onClick={() => props.remove?.(props.id)}
            >
                <div className="close" />
            </div>
        </If>
        <div className="w-1/2 flex flex-col justify-between items-center h-full">
            <If condition={() => Boolean(props.animeTitle)}>
                <div className="w-double text-center m-auto py-2 text-sm">
                    {cropString(props.animeTitle, 32)}
                </div>
            </If>
            <Image
                className='rounded-full overflow-hidden'
                src={fromExternalImg(props.user?.image)}
                alt=''
                width={45}
                height={45}
            />
            <span className="text-xs">{props.user?.name}</span>
            <Input.Stars
                value={props.review}
                isBlocked
            />
        </div>
        <div className="w-1/2 grid place-items-center">
            <span className="tracking-wide">
                {props.comment}
            </span>
        </div>
    </div>
)

export const Comments = (props: Props) => {
    if (!props.comments) {
        return null;
    }

    const items = props.comments.map(item => (
        <Comment
            key={item.id}
            isAdmin={props.isAdmin}
            remove={props.remove}
            {...item} />
    ))

    return (
        <div className="w-full max-w-4xl px-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-24">
            {items}
        </div>
    )
}