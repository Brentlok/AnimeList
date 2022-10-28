import Image from "next/image"
import { Input } from "~/bits";

type Props = {
    comments?: CommentProps[];
}

type CommentProps = {
    id: number;
    user?: {
        image: string | null;
        name: string | null;
    },
    review: number;
    comment: string | null;
}

const Comment = (props: CommentProps) => (
    <div className="w-full h-32 anime flex">
        <div className="w-1/2 flex flex-col justify-between items-center h-full">
            <Image
                className='rounded-full overflow-hidden'
                src={props.user?.image ?? ''}
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

    const items = props.comments.map(item => <Comment key={item.id} {...item} />)

    return (
        <div className="w-full max-w-4xl px-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-24">
            {items}
        </div>
    )
}