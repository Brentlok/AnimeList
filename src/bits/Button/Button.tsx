import Image from "next/image";

type Props = {
    buttonAction?: () => void;
    buttonText: string;
    isLoading?: boolean;
    type?: 'submit' | 'button';
}

export const Button = (props: Props) => (
    <button
        type={props.type ?? 'button'}
        className="border-2 border-solid border-red-500 rounded-xl p-2 m-2 hover:bg-red-500 hover:text-white transition-all"
        onClick={props.buttonAction}
    >
        {
            props.isLoading
                ? (
                    <Image
                        src='/ball-triangle.svg'
                        alt=""
                        width={25}
                        height={25}
                    />
                )
                : props.buttonText
        }
    </button>
)