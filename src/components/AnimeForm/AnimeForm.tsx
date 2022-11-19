import Image from 'next/image';
import { useLayoutEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod';
import { Button, Input } from '~/bits';

export type FormDataType = z.infer<typeof schema> & { file: File | undefined };

type Props = {
    onSubmit: (data: FormDataType) => void;
    anime?: z.infer<typeof schema> & { image?: string };
    isLoading?: boolean;
}

const schema = z.object({
    title: z.string()
        .min(3, { message: 'Min. 3 characters' }),
    title_english: z.string(),
    description: z.string()
        .min(25, { message: 'Min. 25 characters' }),
});

export const AnimeForm = (props: Props) => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            title: props.anime?.title ?? '',
            title_english: props.anime?.title_english ?? '',
            description: props.anime?.description ?? '',
        }
    });
    const [file, setFile] = useState<File>();
    const [avatar, setAvatar] = useState(props.anime?.image ?? '');
    const description = watch('description');

    useLayoutEffect(() => {
        const textarea = document.querySelector('textarea');

        if (!textarea) {
            return;
        }

        textarea.style.height = 'inherit';
        textarea.style.height = `${textarea.scrollHeight + 4}px`;
    }, [description]);

    const img = avatar === ''
        ? (
            <div className='scale-150 my-4'>
                <Input.File
                    setFile={setFile}
                    setDataUrl={setAvatar}
                    placeholder="Upload Image"
                />
            </div>
        ) : (
            <div className="relative w-full h-48">
                <div
                    className="absolute -right-2 -top-2 cursor-pointer"
                    onClick={() => setAvatar('')}
                >
                    <div className="close scale-50 w-5 h-5" />
                </div>
                <Image
                    src={avatar}
                    alt=''
                    layout="fill"
                    objectFit="contain"
                />
            </div>
        );

    return (
        <form
            onSubmit={handleSubmit(data => props.onSubmit({ ...data, file }))}
            className='flex flex-col gap-4 w-full max-w-md'
        >
            <div className='flex justify-center'>
                {img}
            </div>
            <div>
                <h1>Title</h1>
                <input
                    {...register('title')}
                    className="anime w-full"
                    data-is-error={Boolean(errors.title)}
                />
                {errors.title && <p className='text-center text-red-500'>{errors.title.message?.toString()}</p>}
            </div>
            <div>
                <h1>Title English (optional)</h1>
                <input
                    {...register('title_english')}
                    className="anime w-full"
                    data-is-error={Boolean(errors.title_english)}
                />
            </div>
            <div>
                <h1>Description</h1>
                <textarea
                    {...register('description')}
                    className="anime resize-none w-full"
                    data-is-error={Boolean(errors.description)}
                />
                {errors.description && <p className='text-center text-red-500'>{errors.description.message?.toString()}</p>}
            </div>
            <Button
                type='submit'
                buttonText='Submit'
                isLoading={Boolean(props.isLoading)}
            />
        </form>
    );
}