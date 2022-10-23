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
        <div className="w-1/3 flex flex-col justify-between items-center h-full">
            <Image
                className='rounded-full overflow-hidden'
                src={props.user?.image ?? ''}
                alt=''
                width={45}
                height={45}
            />
            <h3>{props.user?.name}</h3>
            <Input.Stars
                value={props.review}
                isBlocked
            />
        </div>
        <div className="w-2/3 grid place-items-center">
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
        <div className="w-1/2">
            {items}
        </div>
    )
}