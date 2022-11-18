type Props = {
    onClick: () => void;
}

export const Edit = (props: Props) => (
    <div
        className="group cursor-pointer"
        onClick={props.onClick}
    >
        <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 19">
            <path className="fill-gray-700 group-hover:fill-red-500 transition-all cursor-pointer" d="M2 16.25h1.4l8.625-8.625-1.4-1.4L2 14.85v1.4ZM16.3 6.175l-4.25-4.2 1.4-1.4A1.92 1.92 0 0 1 14.863 0a1.92 1.92 0 0 1 1.412.575l1.4 1.4c.383.383.583.846.6 1.388a1.806 1.806 0 0 1-.55 1.387L16.3 6.175ZM14.85 7.65l-10.6 10.6H0V14L10.6 3.4l4.25 4.25Zm-3.525-.725-.7-.7 1.4 1.4-.7-.7Z" />
        </svg>
    </div>
);