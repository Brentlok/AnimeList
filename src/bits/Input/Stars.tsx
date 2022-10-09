import { Dispatch, SetStateAction, useState } from "react";

type Props = {
    onChange?: Dispatch<SetStateAction<number>>;
    min?: number;
    max?: number;
    step?: number;
    value: number;
}

type StarProps = {
    isActive: boolean;
    onHover: () => void;
    onClick: () => void;
}

const Star = (props: StarProps) => (
    <svg
        onMouseEnter={props.onHover}
        onClick={props.onClick}
        className="cursor-pointer"
        xmlns="http://www.w3.org/2000/svg" width="25" height="24" fill="none" viewBox="0 0 128 122">
        <path className={props.isActive ? 'fill-red-500' : 'fill-gray-400'} d="M64 18 49.79 46.96 18 51.607l23 22.557L35.566 106 64 90.968l28.434 15.017L87 74.149l23-22.542-31.79-4.647L64 18Z" />
        <path className="fill-gray-700" d="m123.863 42.96-38.372-5.566L68.338 2.685A4.804 4.804 0 0 0 66.146.498c-2.388-1.177-5.29-.196-6.483 2.187L42.51 37.394 4.138 42.96a4.83 4.83 0 0 0-2.766 1.402 4.83 4.83 0 0 0 .09 6.834L29.226 78.21l-6.559 38.148a4.814 4.814 0 0 0 1.92 4.721 4.836 4.836 0 0 0 5.093.362L64 103.432l34.322 18.01a4.808 4.808 0 0 0 3.068.483c2.63-.452 4.398-2.941 3.944-5.566l-6.559-38.148 27.763-27.015a4.811 4.811 0 0 0 1.405-2.76c.408-2.64-1.435-5.084-4.08-5.476Zm-36.77 31.45 5.456 31.722L64 91.169l-28.548 14.978 5.456-31.722L17.815 51.95l31.919-4.631L64 18.463l14.267 28.856 31.919 4.63L87.093 74.41Z" />
    </svg>
);

export const Stars = (props: Props) => {
    const [value, setValue] = useState(-1);

    const isActive = (index: number) => {
        const starIndex = index + 1;

        if (value === -1) {
            return starIndex <= props.value;
        }

        return starIndex <= value;
    }

    const stars = Array(5).fill(0).map((_, index) => (
        <Star
            key={index}
            isActive={isActive(index)}
            onHover={() => setValue(index + 1)}
            onClick={() => props.onChange?.(index + 1)}
        />
    ));

    return (
        <div
            className="flex w-32 gap-1 my-2"
            onMouseLeave={() => setValue(-1)}
        >
            {stars}
        </div>
    )
}