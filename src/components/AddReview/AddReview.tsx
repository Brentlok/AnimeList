import { useState } from "react";
import { Button, Input } from "~/bits";
import { trpc } from "~/utils";

type Props = {
    animeId: number;
    refetch: () => void;
    userReview?: {
        id: number;
        review: number;
        comment: string | null;
    };
}

export const AddReview = ({ animeId, refetch, userReview }: Props) => {
    const [comment, setComment] = useState(userReview?.comment ?? '');
    const [stars, setStars] = useState(userReview?.review ?? 1);
    const create = trpc.useMutation(['review.create']);
    const modify = trpc.useMutation(['review.modify']);

    const addReview = async () => {
        if (userReview !== null && typeof userReview !== 'undefined') {
            await modify.mutateAsync({ reviewId: userReview.id, review: stars, comment })
            refetch();
            return;
        }

        await create.mutateAsync({ animeId, review: stars, comment });
        refetch();
    }

    return (
        <div className="flex flex-col items-center">
            <Input.Stars
                value={stars}
                onChange={setStars}
            />
            <Input.Text
                value={comment}
                onChange={setComment}
                placeholder="Write your opinion!"
            />
            <Button
                isLoading={create.isLoading || modify.isLoading}
                buttonAction={addReview}
                buttonText={Boolean(userReview) ? 'Change Your Review' : 'Add Review'}
            />
        </div>
    );
}